#!/usr/bin/env node
const argv = require( "minimist" )( process.argv.slice(2) );
const chalk = require("chalk");
const getStdin = require("get-stdin");
const GlyphHanger = require( "./src/GlyphHanger" );
const GlyphHangerWhitelist = require( "./src/GlyphHangerWhitelist" );
const GlyphHangerSubset = require( "./src/GlyphHangerSubset" );
const GlyphHangerFontFace = require( "./src/GlyphHangerFontFace" );
const MultipleSpiderPigs = require( "./src/MultipleUrlSpiderPig" );
const debug = require( "debug" )( "glyphhanger:cli" );

const parsePath = require("parse-filepath");

var whitelist = new GlyphHangerWhitelist( argv.w || argv.whitelist, {
	US_ASCII: argv.US_ASCII,
	LATIN: argv.LATIN
});

var gh = new GlyphHanger();
gh.setUnicodesOutput( argv.string );
gh.setWhitelist( whitelist );
gh.setSubset( argv.subset );
gh.setJson( argv.json );
gh.setClassName( argv.classname );
gh.setFamilies( argv.family );
gh.setTimeout( argv.timeout );
gh.setVisibilityCheck( argv.onlyVisible );
gh.setCSSSelector( argv.cssSelector );
if( argv.jsdom ) {
	gh.setEnvironmentJSDOM();
}

var subset = new GlyphHangerSubset();
subset.setOutputDirectory(argv.output);

if( argv.formats ) {
	subset.setFormats( argv.formats );
}
if( argv.subset ) {
	subset.setFontFilesGlob( argv.subset );
}

var fontface = new GlyphHangerFontFace();
fontface.setFamilies( argv.family );
fontface.setCSSOutput( argv.css );

if( argv.subset ) {
	fontface.setSubset( subset );
}


// Unknown: gotta specify what the file is somehow ??
export const subset = (chars, fontToSubset, format) => {
    gh.setStandardInput(chars);

    gh.output(); // idk what this does

    // Load up the file in question
    gh.setSubset(fontToSubset);

    // Set the formats
    gh.setFormats(format);

    try {
        subset.subsetAll(whitelist.getUniversalRangeAsUnicodes());
    } catch (e) {
        console.log('very bad');
    }

    try {
        fontface.writeCSSFiles();
        fontface.output();
    } catch (e) {
        console.log('it didnt work')
    }
}