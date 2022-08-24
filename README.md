# snomed-ui-examples
SNOMED CT User Interface examples

This repository can be run locally, or deployed as a GitHub Pages Website.  The instructions for both options are below:

(Prerequisites for both: node.js (npm is installed with it) )

## GitHub Pages

(Substitue 'IHTSDO' for the name of your organisation in GitHub)

1.	‘clone’ the ‘master’ branch locally and change directory into `snomed-ui-examples/snomed-search-demo`
3.  If not already installed, `npm install -g @angular/cli`
2.	Run $ `npm install -g angular-cli-ghpages` to install a module that handles publishing of Angular applications to GitHub
3.	Run $ `ng build --prod --base-href https://IHTSDO.github.io/snomed-ui-examples/` to build the application ready for deployment (note: the final slash is crucial in the URL following `–base-href`)
4.	Run $ `ngh --no-silent -d dist/snomed-search-demo` to deploy the application to https://IHTSDO.github.io/snomed-ui-examples/

## Locally

1.	‘clone’ the ‘master’ branch locally and change directory into `snomed-ui-examples/snomed-search-demo`
2.	If not already installed, `npm install -g @angular/cli`
3.	Run `ng serve` for a dev server. Navigate to http://localhost:4200/.

Further information can be found under `snomed-ui-examples/snomed-serch-demo/README.md`

To add / change the available terminology servers, open `snomed-ui-examples/snomed-search-demo/src/app/app.component.ts` and 
change the property `terminologyServers` as required.  `snomedServer` can be altered to change the default server.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License

Apache 2.0

See the included LICENSE file for details.

