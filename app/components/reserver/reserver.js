'use strict';

angular.module('ticketbox.components.reserver', [
    'ticketbox.components.basket',
    'ticketbox.components.api'])

    .service('reserver', function(Reservation, basket) {
        return {
            reserve: function(eventId, seat) {
                var reservation = {
                    event_id: eventId,
                    seat_id: seat.seat.id
                };
                return Reservation.save(reservation)
                    .$promise.then(function(data) {
                        seat.state = 'reservedbymyself';
                        seat.reservation_id = data.id;
                        basket.addReservation(data);
                    });
            },
            release: function(seat) {
                var reservationId = seat.reservation_id;
                return Reservation.delete({ 'id': reservationId })
                    .$promise.then(function() {
                        seat.state = 'free';
                        seat.reservation_id = null;
                        basket.removeReservation(reservationId);
                    });
                
            },
            releaseReservation: function(reservation) {
                var reservationId = reservation.id;
                return Reservation.delete({ 'id': reservationId })
                    .$promise.then(function() {
                        basket.removeReservation(reservationId);
                    });
            }
        };
    });