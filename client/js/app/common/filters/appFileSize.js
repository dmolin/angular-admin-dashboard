angular.module('app.common')
.filter('appFileSize', function() {
    return function(input, hasUnits) {

        var size = input / 1024;
        var units = ["Kb", "Mb", "Gb", "Tb", "Pb"];
        var unitIdx = 0;

        hasUnits = (hasUnits === undefined ? true : hasUnits);

        while(size >= 1024 || unitIdx+1 === units.length) {
            size = size / 1024;
            unitIdx++;
        }

        return (size % 1 ? size.toFixed(1) : size.toFixed(0)) + (hasUnits ? units[unitIdx] : '');
    };
});
