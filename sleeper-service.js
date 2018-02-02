/* global EventEmitter3 */
( function( service ) {

    var providers = [];
    
    service.registerProvider = providers.push.bind( providers );
    
    service.provideStore = function() {
        
        return new Promise( function( resolve, reject ) {
            
            var completionProviders = providers.map( function( provider ) {
                
                return provider.promising( function( store ) {
                    
                    resolve( { metadata: provider.describe(), store: store } );
                    
                }, reject );
                
            } );
            service.emit( "choose-store", completionProviders );
            
        } );
        
    };
    
    service.provideFile = function( files ) {
        
        return new Promise( function( resolve, reject ) {
            
            var completionProviders = files.map( function( file ) {
                
                return {
                    
                    id: file.id,
                    name: file.name,
                    isFolder: file.folder,
                    icon: file.icon,
                    choose: function() { resolve( file ); }
                    
                };
                
            } );
            service.emit( "choose-store-file", completionProviders );
            
        } );
        
    };
    
}( window.sleeperService = window.sleeperService || new EventEmitter3() ) );