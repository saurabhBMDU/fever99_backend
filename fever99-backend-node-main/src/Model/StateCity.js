import mongoose from 'mongoose';
const { Schema } = mongoose

const stateCitySchema = new Schema({
  state: {
    type: String,
    required: true,
  },
  city: [],
});

const StateCity = mongoose.model('StateCity', stateCitySchema);
export default StateCity