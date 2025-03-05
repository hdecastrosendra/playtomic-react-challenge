## Summary of the changes

Parse the dates on matches table using `Date` so they can be displayed according to browser local-time.

Before these changes we were manipulating the date as a string; which led to incorrect results because the API **always** returns UTC times. This meant the dates/times would be incorrect for anyone visiting from non-UTC timezones (i.e.: most of the world at some point in the year).

## Motivation

This bug got reported by US clubs to our customer-support team. See [Ticket#123](#not-a-real-link) for the original report.
