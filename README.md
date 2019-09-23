# snomed-ui
SNOMED CT User Interface examples

This repository can be run locally, or deployed as a GitHub Pages Website.  The instructions for both options are below:

(Prerequisites for both: node.js (npm is installed with it) )

GitHub Pages

(Substitue 'IHTSDO' for the name of your organisation in GithHub)

1.	‘clone’ the ‘master’ branch locally and change directory into snomed-ui/snomed-search-demo
2.	Run $ `npm install -g angular-cli-ghpages` to install a module that handles publishing of Angular applications to GitHub
3.	Run $ `ng build --prod --base-href https://IHTSDO.github.io/snomed-ui/` to build the application ready for deployment (note: the final slash is crucial in the URL following `–base-href`)
4.	Run $ `ngh --no-silent -d dist/snomed-search-demo` to deploy the application to https://IHTSDO.github.io/snomed-ui/

Locally

1.	‘clone’ the ‘master’ branch locally and change directory into `snomed-ui/snomed-search-demo`
2.	If not already installed, `npm install -g @angular/cli`
3.	Run `ng serve` for a dev server. Navigate to http://localhost:4200/.

Further information can be found under `snomed-ui/snomed-serch-demo/README.md`

To add / change the available terminology servers, open `snomed-ui/snomed-search-demo/src/app/app.component.ts` and 
change the property ‘terminologyServers’ as required.  ‘snomedServer’ can be altered to change the default server.

