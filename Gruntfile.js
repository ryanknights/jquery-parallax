module.exports = function (grunt)
{
	grunt.initConfig({

		pkg : grunt.file.readJSON('package.json'),

		jshint :
		{
			files :
			{
				src : ['src/jquery-parallax.js']
			}
		},

		uglify :
		{	
			options: 
			{
      			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
       					 '<%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author %> */\n'
    		},
			build :
			{
				files :
				{
					'dist/jquery-parallax.min.js' : ['src/jquery-parallax.js']
				}
			}
		},

		copy :
		{
			build :
			{
				src : ['src/jquery-parallax.js'], dest : 'dist/jquery-parallax.js'
			}
		},

		watch :
		{
			scripts :
			{
				files : ['src/jquery-parallax.js'],
				tasks : ['jshint','uglify', 'copy']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jshint', 'uglify', 'copy']);
};