import mongoose from "mongoose";
import slugify from "slugify";

const {Schema} = mongoose

const caseStudySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

// caseStudySchema.pre('save', function (next) {
//   this.slug = slugify(this.title, { lower: true });
//   next();
// });

// caseStudySchema.pre('findOneAndUpdate', function (next) {
//   const title = this.getUpdate().$set.title;
//   this.update({}, { $set: { slug: slugify(this.title, { lower: true }) } });
//   next();
// });

// caseStudySchema.pre('findByIdAndUpdate', function (next) {
//   const title = this.title;
//   this.update({}, { $set: { slug: slugify(title, { lower: true }) } });
//   next();
// });


const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);

export default CaseStudy;