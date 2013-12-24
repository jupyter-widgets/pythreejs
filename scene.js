require(["notebook/js/widget"], function() {
    var SceneWidgetModel = IPython.WidgetModel.extend({});
    IPython.widget_manager.register_widget_model('SceneWidgetModel', SceneWidgetModel);

    var SceneView = IPython.WidgetView.extend({
        // Called when view is rendered.
        render : function(){
	    
            var width = 600;
            var height = 400;

	    
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize( width, height);
            this.$el.empty().append( this.renderer.domElement );
            
            this.scene = this.scene || new THREE.Scene();
            this.camera = this.camera || new THREE.PerspectiveCamera( 70, width/height, 1, 1000 );
            this.camera.lookAt(this.scene.position);
            console.log(this.camera);
            this.camera.position.set(0,150,400);


            var light = new THREE.PointLight(0xffffff);
            light.position.set(100,250,100);
            this.scene.add(light);
	    
            var geometry = new THREE.SphereGeometry( 30, 32,16 );
            var material = new THREE.MeshLambertMaterial( { color: 0x00cc00} );
            var mesh = new THREE.Mesh( geometry, material );
            this.scene.add( mesh );

            // Set defaults.
            //this.update();
            var that = this;
            this.renderer.render(this.scene, this.camera);
            //that.animate();
            window.ss = this.scene;
            window.cc = this.camera;
            window.rr = this.renderer;
            console.log('done');    
	},
        
        // Handles: Backend -> Frontend Sync
        //          Frontent -> Frontend Sync
        update : function(){
        // nothing to do
            console.log('update');
            //return IPython.WidgetView.prototype.update.call(this);
        },

        display2_child: function(view) {
            console.log('display child');
            this.scene.add(view);
        },
    });

    IPython.widget_manager.register_widget_view('SceneView', SceneView);
    console.log('registered')
});
