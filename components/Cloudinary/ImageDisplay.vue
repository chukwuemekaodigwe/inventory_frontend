<template>
    <CldImage width="987" height="987" src="images/woman-headphones" sizes="50vw" crop="thumb" gravity="faces"
        removeBackground tint="40:253f8c" :underlay="'images/city-skyline'" :overlays="[
            {
                position: {
                    gravity: 'north',
                    y: 60
                },
                text: {
                    color: 'rgb:52a4ff80',
                    fontFamily: 'Source Sans Pro',
                    fontSize: 320,
                    fontWeight: 'black',
                    text: 'MUSIC',
                    letterSpacing: -10,
                    lineSpacing: -100,
                    stroke: true,
                    border: '20px_solid_rgb:2d0eff99',
                }
            },
            {
                position: {
                    gravity: 'south',
                    y: 60
                },
                text: {
                    color: 'rgb:52a4ff80',
                    fontFamily: 'Source Sans Pro',
                    fontSize: 320,
                    fontWeight: 'black',
                    text: 'IS LIFE',
                    letterSpacing: -10,
                    lineSpacing: -100,
                    stroke: true,
                    border: '20px_solid_rgb:2d0eff99',
                }
            }
        ]" />
</template>