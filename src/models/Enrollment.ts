import mongoose, { Schema, model, models } from 'mongoose';

const EnrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = models.Enrollment || model('Enrollment', EnrollmentSchema);

export default Enrollment;