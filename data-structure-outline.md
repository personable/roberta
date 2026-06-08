# Roberta – Data Structure Outline

## Week
- `weekStart` — ISO date string (Monday of the week)

  ## Day ×5 (Mon – Fri)
  - `dayIndex` — 0–4
  - `dayType`
    - `red`
    - `white`

    ## Block ×8
    - `before` — Before School
    - `block1` — Block 1 · 8:25 – 8:49
    - `block2` — Block 2 · 8:50 – 9:38
    - `block3` — Block 3 · 9:40 – 10:28
    - `block4` — Block 4 · 10:30 – 11:18
    - `block5` — Block 5 · 11:20 – 12:08
    - `block67` — Blocks 6 & 7 · 1:20 – 3:00
    - `after` — After School

      ## Schedule Item (0 or more per block)
      - `id` — UUID
      - `title`
      - `description` — optional
      - `completed` — boolean
      - `type`
        - `reminder` — AlarmClock
        - `prep` — Sprout
        - `meeting` — Users
        - `personal` — Heart
        - `testing` — ClipboardCheck
        - `class` — Library

          ## Class Sub-Item (0 or more, only when type = class)
          - `id` — UUID
          - `title`
          - `type`
            - `reminder` — AlarmClock
            - `bell-work` — Bell
            - `announcement` — Megaphone
            - `lesson` — BookOpen
            - `wrap-up` — CheckCheck
            - `other` — ArrowLeft
