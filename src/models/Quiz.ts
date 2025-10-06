import mongoose, { Schema, model, models } from 'mongoose';

const QuizQuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (v: string[]) {
        return v.length >= 2 && v.length <= 6;
      },
      message: 'Options must be between 2 and 6',
    },
  },
  correctAnswer: {
    type: Number,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    min: 1,
  },
});

const QuizSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Quiz description is required'],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: {
      type: [QuizQuestionSchema],
      required: true,
      validate: {
        validator: function (v: any[]) {
          return v.length > 0;
        },
        message: 'At least one question is required',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required (in minutes)'],
      min: 1,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

QuizSchema.index({ course: 1, teacher: 1 });

const Quiz = models.Quiz || model('Quiz', QuizSchema);

export default Quiz;