/* eslint-env jest */
/* eslint-disable no-underscore-dangle */

import { connect, disconnect } from '../db/connection';
import { DealBoards, DealPipelines, DealStages, Deals } from '../db/models';
import {
  dealBoardFactory,
  dealPipelineFactory,
  dealStageFactory,
  dealFactory,
  userFactory,
} from '../db/factories';
import dealMutations from '../data/resolvers/mutations/deals';

beforeAll(() => connect());

afterAll(() => disconnect());

describe('Test deals mutations', () => {
  let _board, _pipeline, _stage, _deal, _user;

  beforeEach(async () => {
    // Creating test data
    _board = await dealBoardFactory();
    _pipeline = await dealPipelineFactory({ boardId: _board._id });
    _stage = await dealStageFactory({
      pipelineId: _pipeline._id,
      boardId: _board._id,
    });
    _deal = await dealFactory({
      pipelineId: _pipeline._id,
      boardId: _board._id,
      stageId: _stage._id,
    });
    _user = await userFactory();
  });

  afterEach(async () => {
    // Clearing test data
    await DealBoards.remove({});
    await DealPipelines.remove({});
    await DealStages.remove({});
    await Deals.remove({});
  });

  test('Check login required', async () => {
    expect.assertions(12);

    const check = async fn => {
      try {
        await fn({}, {}, {});
      } catch (e) {
        expect(e.message).toEqual('Login required');
      }
    };

    // add
    check(dealMutations.dealBoardsAdd);

    // edit
    check(dealMutations.dealBoardsEdit);

    // remove
    check(dealMutations.dealBoardsRemove);

    // add
    check(dealMutations.dealPipelinesAdd);

    // edit
    check(dealMutations.dealPipelinesEdit);

    // remove
    check(dealMutations.dealPipelinesRemove);

    // add
    check(dealMutations.dealStagesAdd);

    // edit
    check(dealMutations.dealStagesEdit);

    // remove
    check(dealMutations.dealStagesRemove);

    // add
    check(dealMutations.dealsAdd);

    // edit
    check(dealMutations.dealsEdit);

    // remove
    check(dealMutations.dealsRemove);
  });

  test('Create board', async () => {
    const boardDoc = { name: 'deal board' };

    DealBoards.createBoard = jest.fn();
    await dealMutations.dealBoardsAdd({}, boardDoc, { user: _user });

    expect(DealBoards.createBoard).toBeCalledWith({
      ...boardDoc,
      userId: _user._id,
    });
    expect(DealBoards.createBoard.mock.calls.length).toBe(1);
  });

  test('Update board', async () => {
    const updateDoc = { name: 'board title' };

    DealBoards.updateBoard = jest.fn();
    await dealMutations.dealBoardsEdit(null, { _id: _board._id, ...updateDoc }, { user: _user });

    expect(DealBoards.updateBoard).toBeCalledWith(_board._id, updateDoc);
    expect(DealBoards.updateBoard.mock.calls.length).toBe(1);
  });

  test('Remove board', async () => {
    DealBoards.removeBoard = jest.fn();
    await dealMutations.dealBoardsRemove({}, { ids: [_board.id] }, { user: _user });

    expect(DealBoards.removeBoard.mock.calls.length).toBe(1);
  });

  test('Create pipeline', async () => {
    const pipelineDoc = { name: 'deal pipeline', boardId: _board._id };

    DealPipelines.createPipeline = jest.fn();
    await dealMutations.dealPipelinesAdd({}, pipelineDoc, { user: _user });

    expect(DealPipelines.createPipeline).toBeCalledWith({
      ...pipelineDoc,
      userId: _user._id,
    });
    expect(DealPipelines.createPipeline.mock.calls.length).toBe(1);
  });

  test('Update pipeline', async () => {
    const updateDoc = { name: 'pipeline title', boardId: 'fakeId' };

    DealPipelines.updatePipeline = jest.fn();
    await dealMutations.dealPipelinesEdit(
      null,
      { _id: _pipeline._id, ...updateDoc },
      { user: _user },
    );

    expect(DealPipelines.updatePipeline).toBeCalledWith(_pipeline._id, updateDoc);
    expect(DealPipelines.updatePipeline.mock.calls.length).toBe(1);
  });

  test('Remove pipeline', async () => {
    DealPipelines.removePipeline = jest.fn();
    await dealMutations.dealPipelinesRemove({}, { ids: [_pipeline.id] }, { user: _user });

    expect(DealPipelines.removePipeline.mock.calls.length).toBe(1);
  });

  test('Create stage', async () => {
    const stageDoc = {
      name: 'deal stage',
      boardId: _board._id,
      pipelineId: _pipeline._id,
    };

    DealStages.createStage = jest.fn();
    await dealMutations.dealStagesAdd({}, stageDoc, { user: _user });

    expect(DealStages.createStage).toBeCalledWith({
      ...stageDoc,
      userId: _user._id,
    });
    expect(DealStages.createStage.mock.calls.length).toBe(1);
  });

  test('Update stage', async () => {
    const updateDoc = { name: 'stage title', boardId: 'fakeId' };

    DealStages.updateStage = jest.fn();
    await dealMutations.dealStagesEdit(null, { _id: _stage._id, ...updateDoc }, { user: _user });

    expect(DealStages.updateStage).toBeCalledWith(_stage._id, updateDoc);
    expect(DealStages.updateStage.mock.calls.length).toBe(1);
  });

  test('Remove stage', async () => {
    DealStages.removeStage = jest.fn();
    await dealMutations.dealStagesRemove({}, { ids: [_stage.id] }, { user: _user });

    expect(DealStages.removeStage.mock.calls.length).toBe(1);
  });

  test('Create deal', async () => {
    const dealDoc = {
      boardId: _deal.boardId,
      pipelineId: _deal.pipelineId,
      stageId: _deal.stageId,
      productIds: _deal.productIds,
      companyId: _deal.companyId,
      amount: _deal.amount,
      closeDate: _deal.closeDate,
      note: _deal.note,
      assignedUserIds: _deal.assignedUserIds,
    };

    Deals.createDeals = jest.fn();
    await dealMutations.dealsAdd({}, dealDoc, { user: _user });

    expect(Deals.createDeals).toBeCalledWith({
      ...dealDoc,
      userId: _user._id,
    });
    expect(Deals.createDeals.mock.calls.length).toBe(1);
  });

  test('Update deal', async () => {
    const updateDoc = { boardId: 'fakeId' };

    Deals.updateDeals = jest.fn();
    await dealMutations.dealsEdit(null, { _id: _deal._id, ...updateDoc }, { user: _user });

    expect(Deals.updateDeals).toBeCalledWith(_deal._id, updateDoc);
    expect(Deals.updateDeals.mock.calls.length).toBe(1);
  });

  test('Remove deal', async () => {
    Deals.removeDeals = jest.fn();
    await dealMutations.dealsRemove({}, { ids: [_deal.id] }, { user: _user });

    expect(Deals.removeDeals.mock.calls.length).toBe(1);
  });
});
