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

// Unknown: gotta specify what the file is somehow ??
const subsetFunc = (chars, fontToSubset) => {
    const extension = 'ttf';
    const fontPathWithExtension = `fonts/${fontToSubset}.${extension}`;

    var gh = new GlyphHanger();
    const whitelist = new GlyphHangerWhitelist(chars);
    gh.setWhitelist(whitelist);
    gh.setSubset(fontPathWithExtension);

    const subset = new GlyphHangerSubset();
    subset.setOutputDirectory('./fonts/subsetted');
    subset.setFormats(extension);
    subset.setFontFilesGlob(fontPathWithExtension);
    
    gh.output();

    try {
        subset.subsetAll(whitelist.getWhitelistAsUnicodes());
    } catch (e) {
        return {
            success: false,
            message: e,
        }
    }

    const fontface = new GlyphHangerFontFace();
    try {
        fontface.writeCSSFiles();
        fontface.output();
    } catch (e) {
        return {
            success: false,
            message: e,
        }
    }

    return {
        success: true,
        message: `/fonts/subsetted/${fontToSubset}-subset.${extension}`,
    }
}

module.exports = subsetFunc;

// console.log(subsetFunc('ye3t', 'hey'));