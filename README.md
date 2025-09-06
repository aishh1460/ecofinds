# EcoFinds - Run with ONE click (Docker)

Welcome to EcoFinds, the sustainable second-hand marketplace. This guide makes it super easy to run the whole app on your computer using Docker.

If you can click a button and run a command, you can do this!

> Need the full feature list or technical deep-dive?
> - See: [FEATURES.md](./FEATURES.md)
> - See: [TECHNICAL_DETAILS.md](./TECHNICAL_DETAILS.md)
> - See: [API-REFERENCE.md](./API-REFERENCE.md)

---

## What you will get
- Backend API (Node + Express) at `http://localhost:5000`
- Frontend (React) at `http://localhost:3000`
- Database (MongoDB) stored safely on your computer

---

## Install Docker (prerequisites)

You only need Docker. No Node.js or MongoDB required!

- macOS/Windows: Install Docker Desktop
  - Download: https://www.docker.com/products/docker-desktop
  - Open Docker Desktop and wait until it says "Docker is running"
- Windows extra notes for .bat files:
  - Run from PowerShell or Command Prompt
  - Keep Docker Desktop running in the background
  - If prompted, enable WSL2 (Docker Desktop will guide you)
- Linux: Install Docker Engine and Compose
  - Follow: https://docs.docker.com/engine/install/
  - Verify install:
    ```bash
    docker --version
    docker compose version
    ```

Once Docker is installed and running, you’re ready!

---

## Quick Start (fastest way)

1) Open a terminal in the project folder: `E-Commerce/`

2) Start everything

```bash
./start.sh
```

On Windows, double-click `start.bat` instead.

3) Wait until you see logs like:

```
ecofinds-backend  | Server running on port 5000
ecofinds-backend  | MongoDB connected successfully
```

4) Open your browser
- Frontend: http://localhost:3000
- API: http://localhost:5000

That's it! You are done.

---

## What the scripts do (in simple words)
- `start.sh` or `start.bat`: Builds and starts everything with Docker
- `stop.sh`: Stops everything
- `logs.sh`: Shows live logs (what is happening right now)

These scripts use `docker-compose.yml` under the hood.

---

## Detailed Steps (with pictures in mind)

1) Install Docker
- Mac/Windows: Install "Docker Desktop" from https://www.docker.com/products/docker-desktop
- Linux: Install Docker and Docker Compose using your package manager

2) Open a terminal in the project folder
- Example: `cd ~/E-Commerce`

3) Start the app
- Mac/Linux:
  ```bash
  ./start.sh
  ```
- Windows:
  - Double-click `start.bat`

4) Watch the logs
- The first time, Docker will download images. This is normal.
- You will see messages as it builds and starts the services.

5) Visit the app
- Open your web browser and go to: http://localhost:3000
- The app will talk to the API at: http://localhost:5000

6) Stop the app when you are done
```bash
./stop.sh
```

7) View logs anytime
```bash
./logs.sh
```

---

## What is inside Docker
We use 3 containers defined in `docker-compose.yml`:
- `mongodb`  → Database
- `backend`  → API server (port 5000)
- `frontend` → React app (port 3000)

The frontend talks to the backend using `REACT_APP_API_URL=http://backend:5000` inside Docker, and you access them from your computer on ports 3000 and 5000.

---

## Environment variables
You do NOT need to create any `.env` files to run Docker. The compose file already sets safe development values.

If you want to change anything:
- Edit `docker-compose.yml` and change the `environment:` values for `backend` and `frontend`.

---

## Common problems and easy fixes

- Port already in use (5000 or 3000)
  - Close the other app using that port
  - Or change the port mapping in `docker-compose.yml`

- Docker says "permission denied" on scripts
  - Run: `chmod +x start.sh stop.sh logs.sh`

- MongoDB connection error
  - Wait a few seconds; the DB might still be starting
  - Then run: `./logs.sh` to see live status

- Nothing shows in the browser
  - Make sure Docker Desktop is running
  - Run: `docker compose ps` to see services

---

## Developer tips (optional)
- Rebuild from scratch: `docker compose build --no-cache`
- Stop and remove everything: `docker compose down -v`
- Check service status: `docker compose ps`

---

## Project overview (what this app can do)
- User login/register
- Create and browse product listings with filters and search
- Add to cart and checkout
- View purchase history
- Responsive, modern design

---

## License
MIT License
 project is licensed under the MIT License.
