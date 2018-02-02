/* global gapi */

( function( service ) {

    function list() {
                            
        return gapi.client.drive.files.list( { 
            
            pageSize: 50,
            fields: "files(id, name, mimeType, iconLink, modifiedTime)"
            
        } ).then( function( res ) {
            
            return res.result.files.map( function( file ) {
                
                return { 
                    
                    id: file.id, 
                    name: file.name, 
                    isFolder: file.mimeType === "application/vnd.google-apps.folder",
                    icon: file.iconLink,
                    modified: file.modifiedTime
                    
                };
                
            } );
            
        } );
        
    }
    
    function provideFile() {
    
        return list().then( function( files ) {
        
            return new Promise( function( resolve, reject ) {
        
                service.provideFile( files ).then( resolve, reject );
            
            } );
            
        } );
        
    }
    
    function buildChooser( resolve, reject ) {
        
        return {
            
            name: "Google Drive",
            description: "Your Google Drive account",
            image: "/gassets/Drive%20Icon256.png",
            choose: function() {
            
                try {
                    
                    gapi.auth2.getAuthInstance().signIn().then( function( user ) {
                        
                        resolve( {
                        
                            provideFile: provideFile
                            
                        } );
                        
                    }, function( e ) {
                        
                        reject( e );
                        
                    } );
                    
                } catch( e ) {
                    
                    reject( e );
                    
                }
                
            }
            
        };
        
    }

    function describeForCurrentUser() {
             
        var metadata = {
            provider: "Your Google Drive",
            user: null,
            error: null
        };
        try {
        
            var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
            metadata.user = {
                
                name: profile.getName(),
                email: profile.getEmail()
                
            };
            
        } catch( ex ) {
            
            metadata.error = ex;
            
        }
        return metadata;
        
    }
            
    var provider = { 
        
        ready: false,
        promising: buildChooser,
        describe: describeForCurrentUser
        
    };
    
    service.registerProvider( provider );
    
    var ns = service.googleDrive = {};
    
    ns.handleClientLoad = function() {

                
        console.log( "Google client is loaded" );
        gapi.load( "client:auth2", function() {

            console.log( "Google auth2 client is loaded" );
            console.log( "Calling client init" );
            gapi.client.init( {
                
                apiKey: "AIzaSyBA5vt92PND_bNslesdICGLy6qv3Q8c8BA",
                clientId: "703171357255-6qbavnijqqdft8ckvq85gtane6c3d82u.apps.googleusercontent.com",
                discoveryDocs: [ "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest" ],
                scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly"
                
            } ).then( function() {

                console.log( "Google auth2 client is initialised" );
                provider.ready = true;
                
            }, function( e ) {
                
                console.log( "Well that didn't work" );
                console.error( e );
                
            } );
            
        } );

        
    };

} ( window.sleeperService ) );