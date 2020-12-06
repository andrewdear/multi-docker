Comments for the Dockerrun.aws.json

hostname: this is the same as what the names are inside a docker-compose file, its what other things will be able to ref it by

essential: IF this is true, if it fails all other containers around that will then be shutdown, at least one definition must be essential

links: this tells aws which other services this container can access by name