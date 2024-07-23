from __future__ import annotations

from datetime import datetime

# TODO: REMOVE BEFORE MERGE :
earliest_time = '13:00'
latest_time = '23:30'
date_format = '%d.%m'
time_format = '%H:%M'
date_range = ['15.08', '16.08', '17.08', '18.08', '19.08']

meeting_unavailability = {
    'captain_dan': [
        {'date': '15.08', 'start': '12:00', 'end': '16:00'},
        {'date': '16.08', 'start': '09:00', 'end': '11:00'},
    ],
    'forrest': [
        {'date': '15.08', 'start': '14:00', 'end': '15:00'},
        {'date': '17.08', 'start': '14:00', 'end': '22:00'},
    ],
    'jenny': [
        {'date': '15.08', 'start': '13:00', 'end': '14:00'},
        {'date': '15.08', 'start': '16:00', 'end': '18:00'},
        {'date': '16.08', 'start': '14:00', 'end': '16:00'},
        {'date': '17.08', 'start': '14:00', 'end': '22:00'},
    ],
}

# TODO, before merge: look at solution for creating/updating blocks as unavailability is registered
# this would spread out this resource intensive process over time

"""
occupied timeslot  
occupied_timeslot:
{
    "id": 1,
    "user": 123,
    "recruitment": 456,
    "start_dt": "2024-07-22T09:00:00Z",
    "end_dt": "2024-07-22T11:00:00Z"
}



"""


def to_datetime(date_str, time_str):
    return datetime.strptime(f'{date_str} {time_str}', '%d.%m %H:%M')


def process_unavailability(interviewers_unavailability):
    unavailability = {}
    for interviewer, times in interviewers_unavailability.items():
        for period in times:
            date = period['date']
            start = to_datetime(date, period['start'])
            end = to_datetime(date, period['end'])
            unavailability.setdefault(interviewer, {}).setdefault(date, []).append((start, end))
    return unavailability


"""
unifies timepoints to create unique time blocks
"""


def create_unique_blocks(unavailability, date_range, earliest_time, latest_time):
    merged_intervals = {}
    for date in date_range:
        time_points = set()
        time_points.add(to_datetime(date, earliest_time))
        time_points.add(to_datetime(date, latest_time))
        for interviewer, dates in unavailability.items():
            if date in dates:
                for start, end in dates[date]:
                    time_points.add(start)
                    time_points.add(end)
        time_points = sorted(time_points)  # Sort after all points have been added
        merged_intervals[date] = time_points
    return merged_intervals


def availability_count(unavailability, merged_intervals):
    available_persons_count = {}
    for date, time_points in merged_intervals.items():
        count_blocks = []
        for i in range(len(time_points) - 1):
            start = time_points[i]
            end = time_points[i + 1]
            count = 0
            for interviewer, dates in unavailability.items():
                if date in dates:
                    available = True
                    for unav_start, unav_end in dates[date]:
                        if unav_start < end and unav_end > start:
                            available = False
                            break
                    if available:
                        count += 1
                else:
                    count += 1  # Available all day if no unavailability for that day
            count_blocks.append((start, end, count))
        available_persons_count[date] = count_blocks
    return available_persons_count


def group_block_by_interviewer_count(available_persons_count):
    grouped_blocks = {}
    for date, blocks in available_persons_count.items():
        current_count = blocks[0][2]
        current_start = blocks[0][0]
        grouped_blocks[date] = []
        for i in range(1, len(blocks)):
            start, end, count = blocks[i]
            if count != current_count:
                grouped_blocks[date].append((current_start, blocks[-1][1], current_count))
                current_start = start
                current_count = count
        grouped_blocks[date].append((current_start, blocks[-1][1], current_count))
    return grouped_blocks


def calculate_block_rating(grouped_blocks):
    block_ratings = {}
    for date, blocks in grouped_blocks.items():
        this_date_ratings = []
        for i in range(len(blocks)):
            start, end, count = blocks[i]
            preceding_block_count = blocks[i - 1][2] if i > 0 else 0
            succeeding_block_count = blocks[i + 1][2] if i < len(blocks) - 1 else 0
            this_block_length = (end - start).total_seconds() / 3600  # Convert to hours
            rating = count + (preceding_block_count - succeeding_block_count) * 0.1 + this_block_length * 0.25
            this_date_ratings.append((start, end, count, rating))
        block_ratings[date] = this_date_ratings
    return block_ratings


# TODO, remove before merge:
interviewers_unavailability = process_unavailability(meeting_unavailability)
blocks = create_unique_blocks(interviewers_unavailability, date_range, earliest_time, latest_time)
interviewer_in_block_count = availability_count(interviewers_unavailability, blocks)
grouped_blocks = group_block_by_interviewer_count(interviewer_in_block_count)
block_ratings = calculate_block_rating(grouped_blocks)

"""
for date, blocks in block_ratings.items():
    print(f'\nDate: {date}')
    for start, end, count, rating in blocks:
        print(f"From {start.strftime('%H:%M')} to {end.strftime('%H:%M')}: {count} employees available, rating: {rating:.2f}")
"""


"""
console output after printing:

Date: 15.08
From 12:00 to 23:30: 2 employees available, rating: 4.78
From 13:00 to 23:30: 1 employees available, rating: 3.62
From 15:00 to 23:30: 2 employees available, rating: 3.92
From 18:00 to 23:30: 3 employees available, rating: 4.58

Date: 16.08
From 09:00 to 23:30: 2 employees available, rating: 5.33
From 11:00 to 23:30: 3 employees available, rating: 6.12 BUG! Should not create blocks outside of the 
From 14:00 to 23:30: 2 employees available, rating: 4.38
From 16:00 to 23:30: 3 employees available, rating: 5.08

Date: 17.08
From 13:00 to 23:30: 3 employees available, rating: 5.53
From 14:00 to 23:30: 1 employees available, rating: 3.38
From 22:00 to 23:30: 3 employees available, rating: 3.48

Date: 18.08
From 13:00 to 23:30: 3 employees available, rating: 5.62

Date: 19.08
From 13:00 to 23:30: 3 employees available, rating: 5.62

"""
