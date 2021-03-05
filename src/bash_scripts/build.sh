#!/bin/bash

echo "Release channel ('dev', 'stage' or 'prod'): "
read CHANNEL

APPNAME='NOT_SET'
BUNDLE_ID='NOT_SET'

if [[ $CHANNEL == 'prod' ]]
then
	CHANNEL='default'
    export APPNAME='Slow the F Down'
    export BUNDLE_ID='com.balt.slowitdown'
fi

if [[ $CHANNEL == 'stage' ]]
then
    export APPNAME='Slow the F Down Stage'
    export BUNDLE_ID='com.balt.slowitdown.stage'
fi

if [[ $CHANNEL == 'dev' ]]
then
    export APPNAME='Slow the F Down Dev'
    export BUNDLE_ID='com.balt.slowitdown.dev'
fi


BRANCH=$(git rev-parse --abbrev-ref HEAD) 

PREVIOUS_VERSION=$(jq -r  '.expo.version' app.json) 
echo "Current Version: $PREVIOUS_VERSION on branch $BRANCH"

echo "Enter Version to Publish: "
read VERSION


# update the JSON files with the new version of the app
cp app.json temp.json
jq ".expo.version = \"$VERSION\"" temp.json > app.json
cp app.json temp.json
jq ".expo.name = \"$APPNAME\"" temp.json > app.json
cp app.json temp.json
jq ".expo.ios.bundleIdentifier = \"$BUNDLE_ID\"" temp.json > app.json

rm temp.json

echo
echo === Building Project Version: ${VERSION} from branch $BRANCH on release channel $CHANNEL===
echo

expo build:ios --release-channel $CHANNEL

# By doing this after Expo publish we make sure not to push to GIT if there was an error AND we don't notify the Slack channel that the update has completed
echo
echo Pushing to GIT branch: ${BRANCH}
echo

git add app.json
git add package.json

TAGNAME=v$VERSION-$BRANCH-$CHANNEL

git commit -m 'New version '\"$VERSION\"' release channel '\"$CHANNEL\"'' 
git tag -a $TAGNAME -m 'New version '\"$VERSION\"' release channel '\"$CHANNEL\"'' 

git push origin $TAGNAME
git push origin ${BRANCH}

# a convenient reminder of what was published to whoever triggered the command
echo
echo === Publish Complete: ${VERSION} from branch $BRANCH on release channel $CHANNEL===
echo