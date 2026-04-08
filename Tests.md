# Test Report — Channel Q&A Platform

This report documents manual testing performed on the Channel Q&A Platform. 


Test Case 1

Feature: Application startup
Steps: Start PostgreSQL with Docker, run migrations/seed, start Next.js app, open homepage.
Expected Result: App loads successfully and homepage is displayed.
Actual Result: Homepage loaded successfully
Status: Pass

Test Case 2

Feature: Channel list display
Steps: Open homepage after seed data is loaded
Expected Result: Existing channels are shown
Actual Result: Seeded channels were displayed on homepage
Status: Pass

Test Case 3

Feature: Create channel as admin
Steps: Sign in as admin, create a new channel from the channel creation form
Expected Result: New channel is added and visible on homepage
Actual Result: Channel was created and displayed correctly
Status: Pass

Test Case 4

Feature: Restrict channel creation for non-admin/user
Steps: Sign in as normal user or log out, attempt to create a channel.
Expected Result: Access denied or channel creation UI unavailable.
Actual Result: Non-admin user could not create channel.
Status: Pass

Test Case 5

Feature: Create post in a channel
Steps: Open a channel page, submit a new post with title and body
Expected Result: Post appears in the selected channel
Actual Result: Post was created and displayed correctly
Status: Pass

Test Case 6

Feature: Reply to a post
Steps: Open a post page, submit a reply
Expected Result: Reply appears under the correct post
Actual Result: Reply displayed correctly under the post
Status: Pass

Test Case 7

Feature: Nested replies
Steps: Reply to an existing reply
Expected Result: Child reply appears nested under parent reply
Actual Result: Nested reply rendered correctly in threaded view
Status: Pass

Test Case 8

Feature: Vote on a post
Steps: Upvote a post, then downvote it, then remove vote
Expected Result: Vote state changes correctly and score updates accordingly
Actual Result: Vote state and score updated correctly
Status: Pass

Test Case 9

Feature: Vote on a reply
Steps: Upvote and downvote a reply.
Expected Result: Reply score updates correctly and only one vote per user is enforced.
Actual Result: Reply voting worked as expected
Status: Pass

Test Case 10

Feature: Screenshot upload
Steps: Open a post, upload a valid PNG/JPG screenshot.
Expected Result: File uploads successfully and attachment is saved
Actual Result: Screenshot uploaded successfully
Status: Pass

Test Case 11

Feature: Screenshot display
Steps: Refresh the post page after upload.
Expected Result: Uploaded screenshot is displayed under the post
Actual Result: Screenshot displayed correctly after refresh
Status: Pass

Test Case 12

Feature: Search functionality
Steps: Search using each supported search type.
Expected Result: Matching results are returned with links and context
Actual Result: Search returned expected results for all implemented query types
Status: Pass

Test Case 13

Feature: User sign up and sign in
Steps: Register a new account, then sign in with that account
Expected Result: Account is created and login succeeds
Actual Result: User account was created and login worked correctly
Status: Pass

Test Case 14

Feature: Protected write actions
Steps: Log out and attempt to create a post/reply/vote/upload.
Expected Result: Action is blocked and user sees access denied or disabled UI
Actual Result: Write actions were blocked for logged out users
Status: Pass

Test Case 15

Feature: Admin delete actions
Steps: Sign in as admin and delete a post/reply/channel/user
Expected Result: Selected item is removed successfully
Actual Result: Admin deletion worked correctly
Status: Pass





## A total of 15 manual test cases were executed