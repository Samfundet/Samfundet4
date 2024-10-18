from __future__ import annotations

from datetime import time, datetime, timedelta
from collections import defaultdict

from django.utils import timezone

from .exceptions import *
from .models.recruitment import (
    Interview,
    Recruitment,
    OccupiedTimeslot,
    RecruitmentPosition,
    RecruitmentApplication,
)


def generate_interview_timeblocks(recruitment_id) -> list[dict]:
    recruitment = Recruitment.objects.get(id=recruitment_id)
    positions = RecruitmentPosition.objects.filter(recruitment=recruitment)
    all_blocks = []

    current_date = timezone.now().date()

    for position in positions:
        start_date = max(recruitment.visible_from.date(), current_date)
        end_date = recruitment.actual_application_deadline.date()
        start_time = time(8, 0)
        end_time = time(23, 0)
        interval = timedelta(minutes=30)

        current_date = start_date
        while current_date <= end_date:
            current_datetime = timezone.make_aware(datetime.combine(current_date, start_time))
            end_datetime = timezone.make_aware(datetime.combine(current_date, end_time))

            unavailability = get_unavailability(recruitment)
            blocks = generate_blocks(position, current_datetime, end_datetime, unavailability, interval)

            all_blocks.extend(
                [
                    {
                        'recruitment_position': position,
                        'date': current_date,
                        'start_dt': block['start'],
                        'end_dt': block['end'],
                        'rating': calculate_rating(block['start'], block['end'], len(block['available_interviewers'])),
                        'available_interviewers': list(block['available_interviewers']),
                    }
                    for block in blocks
                ]
            )

            current_date += timedelta(days=1)

    return all_blocks


def allocate_interviews_for_position(position, limit_to_first_applicant=False) -> int:
    interview_duration = timedelta(minutes=30)

    timeblocks = generate_interview_timeblocks(position.recruitment.id)
    timeblocks = [block for block in timeblocks if block['recruitment_position'] == position]
    timeblocks.sort(key=lambda block: (-block['rating'], block['start_dt']))

    if not timeblocks:
        raise NoTimeBlocksAvailableError(f'No available time blocks for position: {position.name_en}')

    applications = list(RecruitmentApplication.objects.filter(recruitment_position=position, withdrawn=False, interview__isnull=True))
    if not applications:
        raise NoApplicationsWithoutInterviewsError(f'No applications without interviews for position: {position.name_en}')

    interviewer_unavailability = defaultdict(list)

    existing_interviews = Interview.objects.filter(applications__recruitment_position__recruitment=position.recruitment)
    for interview in existing_interviews:
        for interviewer in interview.interviewers.all():
            interviewer_unavailability[interviewer.id].append((interview.interview_time, interview.interview_time + interview_duration))

    interview_count = 0
    all_applicants_unavailable = True
    current_time = timezone.now() + timedelta(hours=24)

    future_blocks = [block for block in timeblocks if block['end_dt'] > current_time]
    if not future_blocks:
        raise NoFutureTimeSlotsError(f'No time slots available at least 24 hours in the future for position: {position.name_en}')

    for block in future_blocks:
        block_start = max(block['start_dt'], current_time)
        current_time = block_start

        while current_time + interview_duration <= block['end_dt'] and applications:
            interview_end_time = current_time + interview_duration

            if any(interview.interview_time == current_time for interview in existing_interviews):
                current_time += interview_duration
                continue

            available_interviewers = get_available_interviewers(block['available_interviewers'], current_time, interview_end_time, interviewer_unavailability)

            if not available_interviewers:
                current_time += interview_duration
                continue

            for application in applications[:]:
                applicant = application.user

                if is_applicant_available(applicant, current_time, interview_end_time, position.recruitment):
                    all_applicants_unavailable = False
                    interview = Interview.objects.create(
                        interview_time=current_time,
                        interview_location=f'Location for {position.name_en}',
                        room=None,
                    )
                    interview.interviewers.set(available_interviewers)
                    interview.save()

                    application.interview = interview
                    application.save()

                    mark_interviewers_unavailable(available_interviewers, current_time, interview_end_time, interviewer_unavailability)

                    existing_interviews = list(existing_interviews) + [interview]

                    interview_count += 1
                    applications.remove(application)

                    if limit_to_first_applicant:
                        return interview_count

                    break

            current_time += interview_duration

        if not applications:
            break

    if interview_count == 0:
        if all_applicants_unavailable:
            raise AllApplicantsUnavailableError(f'All applicants are unavailable for the remaining time slots for position: {position.name_en}')
        raise NoAvailableInterviewersError(f'No available interviewers for any time slot for position: {position.name_en}')

    if applications:
        raise InsufficientTimeBlocksError(
            f'Not enough time blocks to accommodate all applications for position: {position.name_en}. Allocated {interview_count} interviews.'
        )

    return interview_count


def get_unavailability(recruitment):
    return OccupiedTimeslot.objects.filter(recruitment=recruitment).order_by('start_dt')


def generate_blocks(position, start_dt, end_dt, unavailability, interval):
    all_interviewers = set(position.interviewers.all())
    blocks = []
    current_dt = start_dt

    while current_dt < end_dt:
        block_end = min(current_dt + interval, end_dt)
        available_interviewers = all_interviewers.copy()

        for slot in unavailability:
            if slot.start_dt < block_end and slot.end_dt > current_dt:
                available_interviewers.discard(slot.user)

        if not blocks or len(blocks[-1]['available_interviewers']) != len(available_interviewers):
            blocks.append({'start': current_dt, 'end': block_end, 'available_interviewers': available_interviewers})
        else:
            blocks[-1]['end'] = block_end

        current_dt = block_end

    return blocks


def calculate_rating(start_dt, end_dt, available_interviewers_count) -> int:
    block_length = (end_dt - start_dt).total_seconds() / 3600
    rating = (available_interviewers_count * 2) + (block_length * 0.5)
    return max(0, int(rating))


def is_applicant_available(applicant, start_dt, end_dt, recruitment) -> bool:
    existing_interviews = Interview.objects.filter(
        applications__user=applicant, applications__recruitment=recruitment, interview_time__lt=end_dt, interview_time__gte=start_dt
    )
    return not existing_interviews.exists()


def get_available_interviewers(interviewers, start_dt, end_dt, interviewer_unavailability):
    return [interviewer for interviewer in interviewers if is_interviewer_available(interviewer, start_dt, end_dt, interviewer_unavailability)]


def is_interviewer_available(interviewer, start_dt, end_dt, unavailability) -> bool:
    for unavail_start, unavail_end in unavailability.get(interviewer.id, []):
        if unavail_start < end_dt and unavail_end > start_dt:
            return False
    return True


def mark_interviewers_unavailable(interviewers, start_dt, end_dt, unavailability) -> None:
    for interviewer in interviewers:
        unavailability[interviewer.id].append((start_dt, end_dt))
