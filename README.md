# CSV Compare

CSV compare is a utility taking an old and a new CSV with similar headers and spitting out 3 files: new items, deleted items and unchanged items.

### Usage

Go to your directory containing this package:
`node src/index.js -V`


### Example

Note: the folders are relatives

```shell  
node src/index.js 'samples/ACT/201718-ACT-NT-SA-WA-Price-Guide-30Oct.csv' 'samples/ACT/201819-ACT-NT-SA-WA-Price-Guide.csv' 'samples/ACT'
```

##### Output

```shell
Comparing CSV:
  - old filepath: samples/ACT/201718-ACT-NT-SA-WA-Price-Guide-30Oct.csv
  - new filepath: samples/ACT/201819-ACT-NT-SA-WA-Price-Guide.csv
  - destination folder: samples/ACT
TOTAL ITEMS NUMBER:  1281
> OLD FILE ITEMS NUMBER:  625
> NEW FILE ITEMS NUMBER:  656
**** **** ****
SUCCESS, SANITY CHECK IS PASSING
TOTAL NUMBER OF UNIQUE ITEMS: 712
> NEW ITEMS NUMBER: 87
> DELETED ITEMS NUMBER: 56
> UNCHANGED ITEMS NUMBER: 569
```
