import { updateAverageRating } from "../controllers/reviewsController.js";

reviewSchema.post("save", async function () {
  await updateAverageRating(this.targetType, this.targetId);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateAverageRating(doc.targetType, doc.targetId);
  }
});
