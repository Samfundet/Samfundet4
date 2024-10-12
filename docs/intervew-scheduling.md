[**&larr; Back: Documentation Overview**](./README.md)

> [!NOTE]
> This document is a work in progress.

# Automatic Interview Scheduling

The aim of this document is to describe the Automatic Interview Scheduling system of Samfundet4.

It's hard to describe concisely how the system works, so this document contains a few different user stories, describing
how each user role would interact with the system. This will hopefully help you get a better understanding of how the
system works. There's probably going to be a bit of unnecessary rambling in this document, feel free to submit a PR to
fix that:)

First off, this system is **not** meant to be fully automatic, but semi-automatic. We don't want there to be a lot of
magic happening in the background which nobody understands, and we don't want a system that makes changes without user
interaction. Having a system that automatically schedules interviews without any supervision sounds like a recipe for
disaster.

The goal is to help recruitment admins save time, by
automatically scheduling interviews, something which notoriously takes a long time to do manually. There are so many
edge cases in scheduling interviews, so it's important that the system is intuitive and easy to use.

The system must also allow each gang to use the scheduling algorithm of their choosing.

## Admin's perspective

1. Navigate to my gang's recruitment overview page and click on a position.
2. Hit the "Automatically schedule interviews" button.
3. We are shown a dialog (or page), with a list of interviews the algorithm has suggested.
    1. Each interview suggestion shows the date, time, and partaking interviewers
    2. We are able to manually edit these interviews if we wish. This will allow us to manually edit the date, time,
       location and partaking interviewers.
4. We click the submit button, which saves the interviews and sends out emails to affected applicants and interviewers,
   notifying them of the upcoming interview.
    1. The email must not contain sensitive information, it should only contain the name of the gang/section/position
       the applicant has applied for, as well as the date, time, and location of the interview.

## Interviewer's perspective

## User's perspective

## Algorithms

Owner refers to either the Gang or Section which owns the position.

### Samfundet

1. Fetch all unscheduled interviews for this position.
2. Fetch all rooms booked by Owner (if any)
3. Fetch unavailability data for all interviewers and applicants
4. For each unscheduled interview, do:
    1. 

### UKA/ISFiT

1.

### ISFiT

1.

## Race conditions and conflict

The scheduling algorithms described above are very prone to race conditions and conflict if running them at the same
time, which isn't unthinkable since we want to allow multiple people to work on the recruitment system simultaneously.
We solve this by only allowing the interview scheduling to be run by a single process. To run the scheduler, we send a
request to add scheduling for a given position to the queue. The process fetches tasks from the queue and executes them.
