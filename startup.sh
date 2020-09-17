#!/bin/bash

# waiting for gitlab running ready, and then init helm
is_timeout=1
i=1
total_wait=60
while [ $i -le $total_wait ]
do

#    curl -s -o /dev/null -m 5 http://localhost/help
#    if [ $? -ne 0 ]; then

    http_resp_code=`curl -s -o /dev/null -m 5 -w %{http_code} http://localhost/helm/repo/raw/master`
    if [ $http_resp_code -ne 404 ]; then
        echo "#"$i" gitlab service is not running, waiting..."
        i=$(( $i + 1 ))
        sleep 1
        continue
    else
        echo "gitlab service is running, proceed..."
        is_timeout=0
        break
    fi
done

if [ $is_timeout -eq 1 ]; then
    echo "gitlab service is not running after "$total_wait" seconds, system exit..."
    exit 1
fi


sleep 5


# init index.yaml (empty)
helm repo index http://localhost/data/helm-repo

# helm add local minio repo
echo "add helm-repo to helm..."
helm repo add myrepo http://localhost/helm-repo
helm repo update

# helm init done
echo "helm init done."

# start node.js
docker-entrypoint.sh npm start
