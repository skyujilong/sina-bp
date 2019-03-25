const HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlAssetsPlugin {
    apply(compiler){
        compiler.hooks.compilation.tap('HtmlAssetsPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('beforeAssetTagGeneration', (data, cb) => {

                let fileName = data.plugin.options.filename.split('.')[0];
                let entryList = compilation.chunkGroups;
                for(let i = 0; i<entryList.length; i++){
                    if (entryList[i].options.name === fileName){
                        let realyEntryPoint = entryList[i].chunks;
                        let assetsJsList = [];
                        data.assetTags.scripts = ((orgScripts) => {
                            
                            realyEntryPoint.forEach(entryPoint => {
                                
                                orgScripts.forEach(renderJs => {
                                    if (renderJs.attributes.src.indexOf(entryPoint.name + '-' + entryPoint.renderedHash.substring(0, 6))> -1) {
                                        assetsJsList.push(renderJs);
                                    }
                                });
                            });

                            return assetsJsList;
                        })(data.assetTags.scripts);
                        break;
                    }
                }

                cb(null, data);
            })

        });
        
    }
}

module.exports = HtmlAssetsPlugin;