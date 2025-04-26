# Absenin Server v2

A Go server with PostgreSQL for the Absenin attendance management system.

## Prerequisites

- Go 1.21 or later
- PostgreSQL
- Make (optional)

## Setup

1. Clone the repository
2. Create a PostgreSQL database named `absenin`
3. Copy `.env.example` to `.env` and update the database connection string
4. Install dependencies:
   ```bash
   go mod download
   ```
5. Run the server:
   ```bash
   go run main.go
   ```

## API Endpoints

### Attendance

- `POST /api/attendance` - Create a new attendance record
- `GET /api/attendance` - Get all attendance records

## Database Schema

The server uses the following tables:
- users
- classes
- students
- attendances
- student_attendances
- class_students (junction table)

## Development

To run the server in development mode:
```bash
go run main.go
```

To run tests:
```bash
go test ./...
``` 