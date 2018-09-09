The Onboard Wizard app worked on by #conversion.

# Installation

## Local development
Make sure you have permissions for onboard-wizard.squarespace.com.

To begin:
* cd `onboard-wizard`
* `npm install`
* `npm run start:auth`

Use preexisting website -> onboard-wizard.squarespace.com

# Deployment

Note that changes to template.conf must be deployed in order for the local app to "see" the changes.

* Stage: from stage, pull the latest (and test it out!) then `npm run deploy:stage`
* Release: from master, pull the latest (and test it out!) then `npm run deploy:release`

## Using the module
* cd `your-project`
* `npm install @sqs/onboard-wizard`
* Create a new Javascript file, anywhere. Mount the React app to any DOM element.
```js
const wizard = require('@sqs/onboard-wizard')

window.addEventListener('DOMContentLoaded', function () {
  wizard.mount(document.getElementById('app'))
})
```

* Import this file with a `script` tag inside a .region or .page file.
```html
<div id="app"></div>

<script src="/scripts/import-wizard.js"></script>
```
* Optionally, use the included `onboard-wizard.region` as your page layout which includes some mobile-specific meta tags.
  * You can choose this in the CMS after running a deploy

## Updating the module
* Make some changes
* `npm run build:min` - This makes sure we are bundling the least amount of code.
* `npm version (major|minor|patch)`
* Open a PR

# Data flow

Here is how we are planning on making recommendations to the user.

1. Site Title: User enters a site title. We send the text to ML text search to return appropriate images for that site title.
2. Vibes: User selects 3 or more images that vibe with their website idea. In the future, we use these images to get similar images from ML. These can be injected into the final recommendations so there is some dummy content. The first batch of images is determined by the site title the user enters.
3. Layouts: User swipes right or left on a series of templates based on which layouts the user likes. We send the right swipes to ML to grab visually similar templates.
The order of layouts is determined by the images selected in the Vibes screen.
~~4. Features: User selects which features they want for their site. We send these features to ML to get a list of templates that include all of their selected features.~~ (removed for MVP)

The recommendation algorithm will take the list of templates from Features and for each one combine the recommendation scores from Site Title and Layouts. The highest score templates are recommended to the user.

## Very Detailed Diagram

![diagram](https://s3.amazonaws.com/sqs.f.cl.ly/items/2G1V2R160D1l1k0Z3H0Y/Screen%20Shot%202018-03-16%20at%201.59.00%20PM.png?X-CloudApp-Visitor-Id=7529ede58e9091373d49d264c9b61e85&v=2bf4a862 "Diagram")

## Analytics
* We are using a stripped down version of frontsite's `/lib/analytics.js` until `@sqs/analytics` becomes available
* We have a custom [Redux middleware](https://redux.js.org/advanced/middleware) that listens to all actions and fires off analytics events accordingly. See `scripts/middleware/analyticsMiddleware.js`
* New analytics events should be added to that file. If the file gets unwieldy, it should be broken down into smaller files.
* New analytics events should have test coverage in `scripts/middleware/analytics.test.js`. This ensures updating an action won't break the associated analytics event.
* Anything that needs analytics tracking needs to also fire a Redux action. Even if the application state does not change.
* One example is the `<TrackableLink />` component. Any links that send analytics events should use this component.