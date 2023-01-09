const { src, dest, watch, parallel } = require("gulp"); // Extrae las funcionalidades de gulp, que están en la carpeta nodemodules

// CSS

const sass = require("gulp-sass")(require("sass"));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer'); // se encarga de que css corra en los navegadores que no sea compatible
const cssnano = require('cssnano'); // comprime el codigo 
const postcss = require('gulp-postcss'); // algunas transformaciones
const sourcemaps = require('gulp-sourcemaps'); // ayuda a saber donde estan las cosas, ahora que el app.css solo tiene una linea

// IMÁGENES

const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// JAVASCRIPT

const terser = require('gulp-terser-js');

function css(done){
    // Identificar el archivo SASS
    // Compilarlo
    // Almacenarlo en el disco duro

    src("src/scss/**/*.scss") // identifica todos los archivos de las distintas carpetas
        .pipe(sourcemaps.init()) // guardo la referencia de la hoja de estilos
        .pipe(plumber()) // en caso de errores no detiene la ejecución
        .pipe(sass()) // compila
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.')) // misma ubicacion que la hoja de estilos de css
        .pipe(dest("build/css")); // guarda
    done();
}

function imagenes(done) {

    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function versionWebp(done) {

    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));
    done();
}

function javascript(done) {

    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));
    done();
}

function versionAvif(done) {

    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));
    done();
}

function dev(done){
    watch("src/scss/**/*.scss", css); // cuando cambia la hoja de estilos app.scss, se ejecuta la función css
    watch("src/js/**/*.js", javascript); // cuando cambia la hoja de estilos app.scss, se ejecuta la función css
    done();
}

// npx gulp css/dev
// npm run dev
// ctrl + c para detener

exports.css = css;
exports.javascript = javascript;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.imagenes = imagenes;
exports.dev = parallel(dev, javascript, imagenes, versionWebp, versionAvif);