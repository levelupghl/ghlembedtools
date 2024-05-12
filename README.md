# GHL Embed Tools

[Level Up](https://levelupghl.com)

GHL embed tools

# TODO

- [ ] Finish support for queueing sendQueryParams
- [ ] Add documentation showing how to add this script to a page and send custom params


# Usage

```html
<script>
  // Example sending custom params
  !function(w,f,n){if(!w.levelup)w.levelup={};if(w.levelup[f])return;n=w.levelup[f]=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};n.push=n;n.queue=[];}(window,"sendQueryParams");

  window.levelup.sendQueryParams({some_param: "hi", email: "test@example.com", gclid: "12345"})
</script>
```


# Development & Deployment

```bash
# Update version
npm version patch

# Rebuild and deploy
npm run deploy
```
