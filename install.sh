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

# OS
[[ "$OSTYPE" == "darwin"* ]] ; IS_MAC=$?
[[ "$OSTYPE" == "linux-gnu"* ]] ; IS_UBUNTU=$?

# Attempt to install requirements first.
echo ; echo ; echo ; echo "================================================================================================================"
if [ $IS_UBUNTU == 0 ]; then
    do_action "$BOT: Attempt to install requirements (build-essential, procps, curl, file, git, ssh)" "sudo apt update -y ; sudo apt upgrade -y ; sudo apt install -y build-essential procps curl file git ssh" "$X_INTERACTIVE"
elif [ $IS_MAC == 0 ]; then
    do_action "$BOT: Attempt to install requirements (curl, git)" "brew install git curl" "$X_INTERACTIVE"
    do_action "$BOT: Install xcode-select" "xcode-select --install" "$X_INTERACTIVE"
fi

# Fail if missing requirements.
require "git"
require "curl"
require "ssh"
require "file"
require "ps" # procps
### End: requirements ###


### brew ###
# Homebrew is only required on macOS. Ubuntu uses apt/native packages.
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

    # Update and upgrade brew if it exists.
    echo ; echo ; echo ; echo "================================================================================================================"
    do_action "$BOT: Update and upgrade Homebrew (required)?" "" "$X_INTERACTIVE"
    if [ "$?" == 0 ] && [ "$(which brew)" ]; then
        # Update brew.
        echo "Updating and upgrading brew:"
        brew update && brew upgrade && brew upgrade --cask
        echo ; echo "Installing gcc"
        brew install gcc # Recommended by brew.
    fi
fi


### docker ###
if [[ ! "$(docker compose)" ]]; then
    echo ; echo ; echo ; echo "================================================================================================================"
    if [ $IS_UBUNTU == 0 ]; then
        do_action "$BOT: Install docker (required)?" "" "$X_INTERACTIVE"
        if [ "$?" == 0 ]; then
            # https://docs.docker.com/engine/install/ubuntu/
            sudo apt-get remove docker docker-engine docker.io containerd runc
            sudo apt-get update
            sudo apt-get install -y ca-certificates curl gnupg lsb-release
            sudo mkdir -p /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
            echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
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
    if [ $IS_UBUNTU == 0 ]; then
        do_action "$BOT: Install jq (optional)?" "sudo apt install -y jq" "$X_INTERACTIVE"
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
    if [ $IS_UBUNTU == 0 ]; then
        do_action "$BOT: Install uv (required)?" "curl -LsSf https://astral.sh/uv/install.sh | sh ; . ~/.bash_profile" "$X_INTERACTIVE"
    elif [ $IS_MAC == 0 ]; then
        do_action "$BOT: Install uv (required)?" "brew install uv" "$X_INTERACTIVE"
    fi
fi


### Offer to install applications to MacOS ###
if [ $IS_MAC == 0 ]; then
    # Cask packages are MacOS only.

    ### google-chrome ###
    echo ; echo ; echo ; echo "================================================================================================================"
    do_action "$BOT: Install google-chrome (optional)?" "brew install --cask google-chrome" "y"

    ### iterm2 ###
    echo ; echo ; echo ; echo "================================================================================================================"
    echo "Iterm2 is an improved version of Terminal."
    do_action "$BOT: Install iterm2 (optional)?" "brew install --cask iterm2" "y"


    ### visual-studio-code ###
    echo ; echo ; echo ; echo "================================================================================================================"
    do_action "$BOT: Install visual-studio-code (optional)?" "brew install visual-studio-code" "y"


    ### alt-tab ###
    # Enables tabbing similar to Windows.
    # https://alt-tab-macos.netlify.app/
    echo ; echo ; echo ; echo "================================================================================================================"
    echo ; echo ; echo "AltTab is an application that provides a tabbing experience similar to Windows."
    do_action "$BOT: Install alt-tab (optional)?" "brew install --cask alt-tab" "y"
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
        if [ $IS_UBUNTU == 0 ]; then
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
    if [ $IS_UBUNTU == 0 ]; then
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
