#! /bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 加载 NVM
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # 加载 bash 补全

cd /root/project

# mongo
systemctl start mongod
sleep 1

# server
cd ReactNativeServer
npm install
npm start