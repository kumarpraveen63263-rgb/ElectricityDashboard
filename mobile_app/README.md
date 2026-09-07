# TNEB Field Technician Mobile Application (Flutter)

Mobile application for Tamil Nadu Electricity Board (TNEB) **Field Technicians** to receive assigned fault tickets, navigate to transformer assets, log field inspection notes, and update ticket resolution status connected to the central Web Dashboard.

## Features

- **Field Authentication**: Secure login for assigned field engineers and technicians.
- **Assigned Tasks Desk**: View tickets assigned to you with urgency indicators (`critical`, `high`, `watch`).
- **Transformer Context**: View transformer name, asset code, zone, and location coordinates.
- **Interactive Navigation**: Direct GPS map navigation trigger to target transformer coordinates.
- **Field Status & Notes Update**: Transition ticket state (`In Progress`, `Resolved`) with technician field notes.
- **Real-time Sync**: Connects via REST / tRPC APIs to the TNEB Government Control Room backend.

## Project Structure

```
mobile_app/
├── lib/
│   ├── main.dart                  # App Entrypoint & TNEB Theme
│   ├── models/
│   │   └── ticket.dart            # Ticket & Transformer Data Model
│   ├── services/
│   │   └── api_service.dart       # API Service for Web Dashboard backend
│   ├── screens/
│   │   ├── login_screen.dart      # Technician Login
│   │   ├── ticket_list_screen.dart# Assigned Tasks Overview
│   │   └── ticket_detail_screen.dart# Task Detail, GPS & Field Note update
│   └── widgets/
│       └── status_badge.dart      # Reusable status/severity UI badges
└── pubspec.yaml                   # Flutter Dependencies & Assets
```

## Running the App

### Prerequisites
- Flutter SDK (`>= 3.0.0`)
- Android Studio / VS Code / Xcode

### Setup Commands

```bash
cd mobile_app
flutter pub get
flutter run
```
