import ReservationStrategy from "./ReservationStrategy.js";

/*
  Concrete Strategy: Online Reservation
  
  DESIGN PATTERN: Strategy (Concrete Implementation)
  - Implements the algorithm (validation logic) defined in the Strategy interface.
  - Specific logic for online users: checks for duplicates and capacity.
 */
export default class OnlineReservationStrategy extends ReservationStrategy {
    async validate(context) {
        const { userId, date, time, repository, MAX_RESERVATIONS_PER_SLOT } = context;

        // 1. Check if user already has a reservation at this date and time
        const existingReservation = await repository.findByUserDateAndTime(userId, date, time);
        if (existingReservation) {
            throw new Error('You already have a reservation at this date and time');
        }

        // 2. Check if this time slot is already full
        const currentCount = await repository.countByDateAndTime(date, time);
        if (currentCount >= MAX_RESERVATIONS_PER_SLOT) {
            throw new Error('This time slot is fully booked. Please choose another time.');
        }
        
        return true;
    }
}
