
import httpStatus from 'http-status';

import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MeilisearchServices } from './meilisearch.services';

const getItemsFromMeili = catchAsync(async (req, res) => {

  const result = await MeilisearchServices.getAllPosts(
    req.query );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts Retrieved Successfully',
    data: result,
  });
});

export const MeiliSearchController = {
  getItemsFromMeili,
};