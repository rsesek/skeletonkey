ZIP_FILES=manifest.json \
	  extension.html \
	  core.html \
	  core.css \
	  core.js \
	  options.js \
	  pbkdf2.js \
	  common.css \
	  icon19.png \
	  icon48.png \
	  icon128.png

extension:
	zip skeletonkey.zip ${ZIP_FILES}
