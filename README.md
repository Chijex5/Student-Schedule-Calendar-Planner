# Dynamic Study Calendar with Progress Tracking & Backup

## Overview
This is a responsive, interactive study calendar built with TypeScript and Vite, designed to help users efficiently plan, track, and back up their learning goals. With a customizable schedule, real-time progress tracking, and data portability, this tool ensures learners stay organized and motivated.

## Key Features

### Course Setup & Calendar Generation
- Users input at least 3 courses, each with a name, start date, and end date.
- Upon submission, a structured study timetable is instantly generated, distributing study days across the specified timeframe.

### Interactive Schedule Shuffling
- Not satisfied with the default schedule? Click the Shuffle button to dynamically reorganize course dates until the plan aligns with your preferences.

### Task Completion & Progress Tracking
- Mark each day's study task as completed with a click.
- A visual progress bar updates per course, showing real-time completion percentages to keep you motivated.

### Data Portability via JSON Backup
- Save your entire study plan (courses, schedules, progress) to a .json file for backup.
- Restore your study calendar on any device by uploading the saved file, ensuring seamless continuity.

### Responsive Styling & Smooth UX
- Modern UI with intuitive controls, responsive grids, and dynamic color-coded courses.
- Smooth animations enhance interactions like shuffling, task completion, and progress updates.

## Technical Implementation

| Technology  | Purpose  |
|-------------|----------|
| TypeScript  | Ensures type safety & scalable architecture for complex logic.  |
| Vite  | Provides fast development workflows & optimized builds.  |
| Local Storage (optional enhancement) | Temporarily persists data during active sessions.  |
| Dynamic Styling | CSS Modules or Styled Components for maintainable UI.  |

## User Flow
1. Setup: Add courses with dates → Generate calendar.
2. Customize: Shuffle schedules until satisfied.
3. Track: Mark tasks as done & monitor progress.
4. Save/Restore: Export data to JSON & reload later.

## Why This Stands Out
Unlike rigid study planners, this tool offers:
- Flexibility (Shuffling schedules)
- Motivation (Real-time progress tracking)
- Data Security (JSON backup for continuity)

Built with TypeScript for reliability and Vite for fast performance, this study planner is perfect for students, lifelong learners, or anyone managing multiple goals.
