import subprocess
import pathlib


def build():
    client_path = pathlib.Path(__file__).parent / "transmanga" / "client"
    subprocess.run("npm install", shell=True, check=True, cwd=client_path)
    subprocess.run("npm run build", shell=True, check=True, cwd=client_path)


if __name__ == "__main__":
    build()
