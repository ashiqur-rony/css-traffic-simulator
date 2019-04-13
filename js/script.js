/**
 * Handle the vehicle functionality
 *
 * @author Ashiqur Rahman
 * @url http://choobs.com
 * @author_url http://ashiqur.com
 **/

let vehicleEl = '<div class="vehicle %vehicle-class%"></div>';
let emergencyClass = ['police', 'ambulance'];
let vehicleClass = ['car', 'truck'];
let priorityVehicles = ['taxi', 'emergency'];
let lane1Reset = '';
let lane2Reset = '';
let lane3Reset = '';
let carSpace = 200;     //Space a car takes
let busSpace = 200;     //Space a bus takes
let truckSpace = 200;   //Space a truck takes
let totalLane = 2200;   //Total lane width
let occupy = 100;        //Percentage of occupancy on the lane
let lane1Counter = 0;
let lane2Counter = 0;
let lane3Counter = 0;

(function ($) {
    $(document).ready(function () {
        lane1Reset = $('#lane-1').html();
        lane2Reset = $('#lane-2').html();
        lane3Reset = $('#lane-3').html();
        resetVehicleDisplay();

        $('.add-vehicle').on('click', function(e) {
            e.preventDefault();
            occupy = $('input#occupy').val();
            resetVehicleDisplay();
        });
    });
})(jQuery);

function resetVehicleDisplay() {
    $('#lane-1').html(lane1Reset);
    $('#lane-2').html(lane2Reset);
    $('#lane-3').html(lane3Reset);
    lane1Counter = 0;
    lane2Counter = 0;
    lane3Counter = 0;

    let vehicle = '';
    let carClass = '';
    let lane1Count = $('#lane-1').children('.car').length + $('#lane-1').children('.truck').length;
    let lane2Count = $('#lane-2').children('.car').length + $('#lane-2').children('.truck').length;
    let lane3Count = $('#lane-3').children('.car').length + $('#lane-3').children('.bus').length + $('#lane-3').children('.truck').length;

    let spaceRemaining = Math.floor(totalLane * occupy / 100);

    let haveSpace = true;

    while (haveSpace) {
        let lane1Space = spaceRemaining - ($('#lane-1').children('.car').length * carSpace + $('#lane-1').children('.truck').length * truckSpace);
        let lane2Space = spaceRemaining - ($('#lane-2').children('.car').length * carSpace + $('#lane-2').children('.truck').length * truckSpace);

        let requiredSpace = carSpace;
        let lane1Filled = false;
        let lane2Filled = false;

        let carClass = '';

        let selected = vehicleClass[Math.floor(Math.random() * 2)];
        if (selected == 'truck') {
            if (($('.vehicle').length % 4) == 0) {
                requiredSpace = truckSpace;
            } else {
                selected = 'car';
            }
        }

        if (selected == 'car') {
            carClass += ' car-' + (Math.floor(Math.random() * 7) + 1);
            vehicle = vehicleEl.replace('%vehicle-class%', 'car ' + carClass);
        } else if (selected == 'truck') {
            vehicle = vehicleEl.replace('%vehicle-class%', 'truck ' + carClass);
        }

        //fill lane 1
        if (lane1Space >= requiredSpace) {
            let html = $('#lane-1').html();
            $('#lane-1').html('');
            $('#lane-1').html(vehicle + html);
            lane1Count++;
        } else {
            lane1Filled = true;
        }

        //fill lane 2
        if (lane2Space >= requiredSpace) {
            let html = $('#lane-2').html();
            $('#lane-2').html('');
            $('#lane-2').html(vehicle + html);
            lane2Count++;
        } else {
            lane2Filled = true;
        }

        if (lane1Filled && lane2Filled) {
            haveSpace = false;
        }
    }

    //fill lane 3
    haveSpace = true;

    while (haveSpace) {

        let prioritySpaceRemaining = Math.floor(totalLane * (occupy - 30) / 100);
        let lane3Space = prioritySpaceRemaining - ($('#lane-3').children('.car').length * carSpace + $('#lane-3').children('.bus').length * busSpace);
        let lane3Filled = false;
        let requiredSpace = carSpace;
        let carClass = '';

        //priority lane only have taxi and emergency
        let selected = priorityVehicles[Math.floor(Math.random() * 2)];
        requiredSpace = carSpace;
        if (selected == 'taxi') {
            vehicle = vehicleEl.replace('%vehicle-class%', 'car taxi ' + carClass);
        } else if (selected == 'emergency') {
            carClass += emergencyClass[Math.floor(Math.random() * 2)];
            vehicle = vehicleEl.replace('%vehicle-class%', 'car emergency ' + carClass);
        }

        if (lane3Space >= requiredSpace) {
            let html = $('#lane-3').html();
            $('#lane-3').html('');
            $('#lane-3').html(vehicle + html);
            lane3Count++;
        } else {
            lane3Filled = true;
        }

        if (lane3Filled) {
            haveSpace = false;
        }
    }

    if(occupy < 65) {
        $('.road-container').removeClass('slowest').removeClass('slow');
    } else if (occupy >= 65) {
        $('.road-container').removeClass('slowest').addClass('slow');
    } else if (occupy == 100) {
        $('.road-container').removeClass('slow').addClass('slowest');
    }

    $('#lane-1-count').html(lane1Counter);
    $('#lane-2-count').html(lane2Counter);
    $('#lane-3-count').html(lane3Counter);

    $(document).find('.vehicle').each(function (index, item) {
        $(item).onVehiclePassed(vehiclePassedBy);
    });
}

function vehiclePassedBy(vehicle) {
    let lane = $(vehicle).closest('.lane').attr('id');
    if (lane == 'lane-1') {
        lane1Counter++;
    } else if (lane == 'lane-2') {
        lane2Counter++;
    } else if (lane == 'lane-3') {
        lane3Counter++;
    }

    $('#lane-1-count').html(lane1Counter);
    $('#lane-2-count').html(lane2Counter);
    $('#lane-3-count').html(lane3Counter);
}

/**
 * Extension to handle element passed out of viewport
 * @param trigger
 * @param millis
 * @returns {jQuery|HTMLElement}
 */
jQuery.fn.onVehiclePassed = function (trigger, millis) {
    let checkPoint = window.innerWidth - 50;
    if (millis == null) millis = 50;
    let o = $(this[0]); // our jquery object
    if (o.length < 1) return o;

    let lastPos = null;
    setInterval(function () {
        if (o == null || o.length < 1) return o; // abort if element is non existent

        let newPos = o.position().left;

        if (lastPos < checkPoint && newPos >= checkPoint) {
            $(this).trigger('onVehiclePassed', {vehicle: o});
            if (typeof (trigger) == "function") trigger(o);
        }
        lastPos = newPos;
    }, millis);

    return o;
};
