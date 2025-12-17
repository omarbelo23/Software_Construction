/*
  Strategy Pattern - Base Strategy Interface
  
  DESIGN PATTERN: Strategy (Interface/Abstract Class)
  - Defines a common interface for all supported algorithms (strategies).
  - The Context (ReservationService) uses this interface to call the algorithm defined by a Concrete Strategy.
 */
export default class ReservationStrategy {
    constructor() {
        if (this.constructor === ReservationStrategy) {
            throw new Error("Abstract class 'ReservationStrategy' cannot be instantiated directly.");
        }
    }

    // Validate reservation data
    // context: reservation info (userId, date, time, size, repository)
    // Throws error if validation fails

    async validate(context) {
        throw new Error("Method 'validate()' must be implemented.");
    }
}
