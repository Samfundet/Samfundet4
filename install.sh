#!/bin/bash

BOT="[samf-bot]"

# "$?" references return code from last command.

### Imports ###
echo ; echo ; echo ; echo "================================================================================================================"
[ -f bash_utils.sh ] && echo "$BOT: Don't mind me, I'm just sourcing 'bash_utils.sh'" && . bash_utils.sh
[ -f ~/.bash_profile ] && echo "$BOT: Don't mind me, I'm just sourcing '~/.bash_profile'" && . ~/.bash_profile
### End: Imports ###


# Initialise global 'X_INTERACTIVE'. Defaults to "y".
echo ; echo ; echo ; echo "================================================================================================================"
X_INTERACTIVE=${X_INTERACTIVE:="y"}
echo "$BOT: Running script in interaction mode: '$X_INTERACTIVE'"


### Welcome ###
echo ; echo ; echo ; echo "================================================================================================================"
echo
echo "$BOT:"
echo "  Hi, and welcome to Samfundet!"
echo
echo "  I will provide everything you need to clone, build, and run the project."
echo
echo "  I am partly interactive and will at some point depend on manual input from you to complete the installation."
echo "   (These steps consists of first time setup of ssh keys etc...)"
echo
echo "  If you know that you have already configured what is asked of you, "
echo "   you may skip the step (no need to remember, I will mention it again)."
echo
if [ "$X_INTERACTIVE" == "y" ]; then
    echo "  I will prompt for permission before performing any action,"
    echo "   although most of them are neccessary to complete the script."
    echo
    echo "  Questions annotated with (required) must run to succeed successfully."
fi
echo
do_action "\"I understand\"" "echo '$BOT: Here we go!'; sleep 1;" "y" || eval "echo \"$BOT: That's okay, I can't read either 😔. I'll let you off the hook for now...\"; sleep 1; exit 1"
### End: Welcome ###


### Requirements ###

# OS and Linux distribution.
IS_MAC=1
IS_LINUX=1
LINUX_DISTRO=""

if [[ "$OSTYPE" == "darwin"* ]]; then
    IS_MAC=0
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    IS_LINUX=0

    if [ ! -r /etc/os-release ]; then
        echo "$BOT: Cannot determine the Linux distribution because /etc/os-release is unavailable."
        exit 1
    fi

    . /etc/os-release
    case "${ID:-}" in
        ubuntu|fedora|arch)
            LINUX_DISTRO="$ID"
            ;;
        *)
            echo "$BOT: Unsupported Linux distribution: ${PRETTY_NAME:-${ID:-unknown}}"
            echo "$BOT: Supported Linux distributions are Ubuntu, Fedora, and Arch Linux."
            exit 1
            ;;
    esac
else
    echo "$BOT: Unsupported operating system: $OSTYPE"
    exit 1
fi

# Attempt to install requirements first.
echo ; echo ; echo ; echo "================================================================================================================"
if [ $IS_LINUX == 0 ]; then
    case "$LINUX_DISTRO" in
        ubuntu)
            do_action "$BOT: Attempt to install requirements (curl, git, ssh)" "sudo apt update ; sudo apt install -y curl git ssh" "$X_INTERACTIVE"
            ;;
        fedora)
            do_action "$BOT: Attempt to install requirements (curl, git, ssh)" "sudo dnf install -y curl git openssh-clients" "$X_INTERACTIVE"
            ;;
        arch)
            do_action "$BOT: Attempt to install requirements (curl, git, ssh)" "sudo pacman -S --needed curl git openssh" "$X_INTERACTIVE"
            ;;
    esac
elif [ $IS_MAC == 0 ]; then
    do_action "$BOT: Attempt to install requirements (curl, git)" "brew install git curl" "$X_INTERACTIVE"
    do_action "$BOT: Install xcode-select" "xcode-select --install" "$X_INTERACTIVE"
fi

# Fail if missing requirements.
require "git"
require "curl"
require "ssh"
### End: requirements ###


### brew ###
# Homebrew is only required on macOS. Linux uses its distribution's package manager.
if [ $IS_MAC == 0 ]; then
    # Install brew if it doesn't exist.
    if [ ! "$(which brew)" ]; then
        echo ; echo ; echo ; echo "================================================================================================================"
        echo "Homebrew is a package manager for macOS."
        do_action "$BOT: Install Homebrew (required)?" "" "$X_INTERACTIVE"
        if [ "$?" == 0 ]; then
            # Non-X_INTERACTIVE install.
            NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            # Update PATH and current shell (Apple Silicon vs Intel).
            if [ -x /opt/homebrew/bin/brew ]; then
                echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME"/.bash_profile
                eval "$(/opt/homebrew/bin/brew shellenv)"
            elif [ -x /usr/local/bin/brew ]; then
                echo 'eval "$(/usr/local/bin/brew shellenv)"' >> "$HOME"/.bash_profile
                eval "$(/usr/local/bin/brew shellenv)"
            fi
        fi
    fi
fi


### docker ###
if ! docker compose version >/dev/null 2>&1; then
    echo ; echo ; echo ; echo "================================================================================================================"
    if [ $IS_LINUX == 0 ]; then
        do_action "$BOT: Install docker (required)?" "" "$X_INTERACTIVE"
        if [ "$?" == 0 ]; then
            case "$LINUX_DISTRO" in
                ubuntu)
                    # https://docs.docker.com/engine/install/ubuntu/
                    DOCKER_CONFLICTS=()
                    for package in docker.io docker-compose docker-compose-v2 docker-doc docker-buildx podman-docker containerd runc; do
                        if [ "$(dpkg-query -W -f='${Status}' "$package" 2>/dev/null)" = "install ok installed" ]; then
                            DOCKER_CONFLICTS+=("$package")
                        fi
                    done

                    if [ ${#DOCKER_CONFLICTS[@]} -gt 0 ]; then
                        echo "$BOT: Docker cannot be installed while these conflicting packages are present:"
                        printf '  %s\n' "${DOCKER_CONFLICTS[@]}"
                        echo
                        echo "$BOT: No packages were removed. Review the packages above, then remove them yourself and rerun this script."
                        echo "$BOT: Docker's suggested command is:"
                        echo "  sudo apt remove ${DOCKER_CONFLICTS[*]}"
                        exit 1
                    fi

                    sudo apt update
                    sudo apt install -y ca-certificates curl
                    sudo install -m 0755 -d /etc/apt/keyrings
                    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
                    sudo chmod a+r /etc/apt/keyrings/docker.asc
                    sudo tee /etc/apt/sources.list.d/docker.sources > /dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: ${UBUNTU_CODENAME:-$VERSION_CODENAME}
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
                    sudo apt update
                    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
                    ;;
                fedora)
                    # https://docs.docker.com/engine/install/fedora/
                    sudo dnf config-manager addrepo --from-repofile https://download.docker.com/linux/fedora/docker-ce.repo
                    sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
                    sudo systemctl enable --now docker
                    ;;
                arch)
                    # https://wiki.archlinux.org/title/Docker
                    sudo pacman -S --needed docker docker-buildx docker-compose
                    sudo systemctl enable --now docker
                    ;;
            esac
        fi
    elif [ $IS_MAC == 0 ]; then
        do_action "$BOT: Install docker (required)?" "brew install docker docker-compose; mkdir -p ~/.docker/cli-plugins; ln -sfn /usr/local/opt/docker-compose/bin/docker-compose ~/.docker/cli-plugins/docker-compose" "$X_INTERACTIVE"
    fi
fi

### colima ###
# Replacement for docker-desktop. Only needed for MacOS.
# https://github.com/abiosoft/colima
if [ ! "$(which colima)" ] && [ $IS_MAC == 0 ]; then
    echo ; echo ; echo ; echo "================================================================================================================"
    do_action "$BOT: Install colima (required unless you have docker-desktop)?" "brew install colima && colima start" "$X_INTERACTIVE"
fi


### bash-completion ###
# echo ; echo ; echo ; echo "================================================================================================================"
# do_action "$BOT: Install bash-completion (recommended)?" "brew install bash-completion" $X_INTERACTIVE


### jq ###
if [ ! "$(which jq)" ]; then
    echo ; echo ; echo ; echo "================================================================================================================"
    echo "Json parser."
    echo "Used to parse extensions.json for VSCode setup."
    if [ $IS_LINUX == 0 ]; then
        case "$LINUX_DISTRO" in
            ubuntu)
                do_action "$BOT: Install jq (optional)?" "sudo apt install -y jq" "$X_INTERACTIVE"
                ;;
            fedora)
                do_action "$BOT: Install jq (optional)?" "sudo dnf install -y jq" "$X_INTERACTIVE"
                ;;
            arch)
                do_action "$BOT: Install jq (optional)?" "sudo pacman -S --needed jq" "$X_INTERACTIVE"
                ;;
        esac
    elif [ $IS_MAC == 0 ]; then
        do_action "$BOT: Install jq (optional)?" "brew install jq" "$X_INTERACTIVE"
    fi
fi


### uv ###
# uv is the Python package and project manager. It replaces pip, poetry, pyenv
# and virtualenv: it manages the Python version (defined in backend/.python-version),
# the virtual environment and the dependencies.
# https://docs.astral.sh/uv/
if [ ! "$(which uv)" ]; then
    echo ; echo ; echo ; echo "================================================================================================================"
    if [ $IS_LINUX == 0 ]; then
        do_action "$BOT: Install uv (required)?" "curl -LsSf https://astral.sh/uv/install.sh | sh ; . ~/.bash_profile" "$X_INTERACTIVE"
    elif [ $IS_MAC == 0 ]; then
        do_action "$BOT: Install uv (required)?" "brew install uv" "$X_INTERACTIVE"
    fi
fi


### Offer to install applications to MacOS ###
if [ $IS_MAC == 0 ]; then
    # Cask packages are MacOS only.

    ### visual-studio-code ###
    echo ; echo ; echo ; echo "================================================================================================================"
    do_action "$BOT: Install visual-studio-code (optional)?" "brew install visual-studio-code" "y"
fi


### Setup project ###
echo ; echo ; echo ; echo "================================================================================================================"
do_action "$BOT: Do you wish to create a new SSH key?" "" "$X_INTERACTIVE"
if [ "$?" == 0 ]; then
    get_var_with_confirm "EMAIL" "Email at github.com: "
    ssh-keygen -t ed25519 -C "$EMAIL"
fi

echo ; echo ; echo ; echo "================================================================================================================"
echo "Add your public SSH key to GitHub if you have not already done so:"
echo "  https://github.com/settings/ssh/new"
echo
echo "Public SSH keys found on this machine:"
find "$HOME/.ssh" -maxdepth 1 -type f -name '*.pub' -print 2>/dev/null
echo
echo "Copy the contents of the public key (the file ending in .pub) to GitHub."
echo "Never copy or share the corresponding private key."
do_action "$BOT: My public SSH key is registered with GitHub" "" "$X_INTERACTIVE" || exit 1


# Clone project.
echo ; echo ; echo ; echo "================================================================================================================"
do_action "$BOT: Clone repo git@github.com:Samfundet/Samfundet4.git?" "git clone git@github.com:Samfundet/Samfundet4.git" "$X_INTERACTIVE"

### Setup project if cloned. ###
if [ "$(ls Samfundet4/README.md)" ] ; then # Simple check if an arbitrary file exists.
    # Some extra steps.
    cd Samfundet4 || exit
    cp .env.example .env
    cp backend/.env.example backend/.env
    cp backend/.docker.example.env backend/.docker.env
    cp frontend/.env.local.example frontend/.env.local
    cp frontend/.env.docker.example frontend/.env.docker
    cp .vscode/settings.default.json .vscode/settings.json

    echo ; echo ; echo ; echo "================================================================================================================"
    do_action "$BOT: Do you wish to configure VSCode?" "" "$X_INTERACTIVE"
    if [ "$?" == 0 ] ; then
        echo "VSCode setup (requires that you cloned the project):"
        echo
        echo "1. Open VSCode"
        echo "2. Press CMD+Shift+P"
        echo "3. Type 'install code'"
        echo "4. Select the alternative 'Shell Command: Install 'code' command in PATH' "
        echo
        do_action "$BOT: When this is finished, confirm to continue..." "" "$X_INTERACTIVE"

        # Install default extensions.
        echo ; echo ; echo ; echo "================================================================================================================"
        do_action "$BOT: Install default vscode extensions from .vscode/extensions.json?" "install_extensions .vscode/extensions.json" "$X_INTERACTIVE"

        # Install recommended extensions.
        # echo ; echo ; echo ; echo "================================================================================================================"
        # do_action "$BOT: Install recommended vscode extensions from .vscode/extensions.json.recommended?" "install_extensions .vscode/extensions.json.recommended" $X_INTERACTIVE
        
    fi

    # Install python virtual environment with dependencies.
    # uv reads backend/.python-version, downloads the pinned Python if needed,
    # creates backend/.venv and installs the locked dependencies.
    echo ; echo ; echo ; echo "================================================================================================================"
    do_action "$BOT: Install virtual python environment (uv)?" "(cd backend && uv sync)" "$X_INTERACTIVE"

    # Build project.
    echo ; echo ; echo ; echo "================================================================================================================"
    do_action "$BOT: Build project?" "" "$X_INTERACTIVE"
    if [ "$?" == 0 ]; then
        if [ $IS_LINUX == 0 ]; then
            sudo docker compose build
        elif [ $IS_MAC == 0 ]; then
            docker compose build # Mac doesn't need to use sudo.
        fi
    fi
fi


### Cleanup ###
unset X_INTERACTIVE
unset EMAIL


### Final messages ###
echo ; echo ; echo ; echo "================================================================================================================"
echo
cat << EOF
           _ _       _                  _ 
     /\   | | |     | |                | |
    /  \  | | |   __| | ___  _ __   ___| |
   / /\ \ | | |  / _' |/ _ \| '_ \ / _ \ |
  / ____ \| | | | (_| | (_) | | | |  __/_|
 /_/    \_\_|_|  \__,_|\___/|_| |_|\___(_)

EOF
echo
echo "Remember to configure environment settings in file '.env'"
echo
echo "You can now run this command to start the project in a docker container:"
# echo "    docker build -t samfundet/Samfundet4 . && docker run --rm --name samfundet-Samfundet4 -p 8000:8000 -it samfundet/Samfundet4"
echo "    $ docker compose up"
echo
echo "NOTE: See Dockerfile for more useful commands."
echo
do_action "$BOT: I can also start the project if you'd like" "" "y"
if [ "$?" == 0 ]; then
    if [ $IS_LINUX == 0 ]; then
        sudo docker compose up
    elif [ $IS_MAC == 0 ]; then
        # Mac doesn't need to use sudo.
        docker compose up
    fi
fi

# echo "You can now run these commands to start the project:"
# echo "    uv run python manage.py collectstatic"
# echo "    uv run python manage.py migrate"
# echo "    uv run python manage.py runserver"
