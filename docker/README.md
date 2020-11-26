![Jodit WYSIWYG editor](https://raw.githubusercontent.com/xdan/jodit/master/examples/assets/logo.png)

# Docker environment for Jodit's contributors
All you need to build and test Jodit with a docker environment.

No installation required on the host except docker.

## Docker installation
Follow instructions on [docker website](https://docs.docker.com/get-docker/)

## Available commands
All commands must be executed in the "docker" directory
```bash
cd docker
```

### Installation of the docker environment for Jodit
```bash
./install
```

### To Run webpack Hot Reload server:
Ctrl+C to close this server.

To try Jodit, you can open up http://localhost:2000/ in your browser.
```bash
./start
```

### To build Jodit
The build files are in the "build" directory.
```bash
./build
```

### To launch tests of Jodit
To follow the tests, you can open up http://localhost:2002/ in your browser.
```bash
./test
```

### Uninstallation of the docker environment for Jodit
```bash
./uninstall
```
