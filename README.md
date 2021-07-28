# App description
Reduce routine by making algorithms that can generate and configure code templates instead of you;
https://gtftt.github.io/boilerplate_react/

### Deployment

**npm run deploy** to deploy gh-pages


# Known issues

If you have the following issue while deploying
```
FATAL ERROR: MarkCompactCollector: young object promotion failed Allocation failed - JavaScript heap out of memory
```
then do this
\
```export NODE_OPTIONS=--max-old-space-size=8192```