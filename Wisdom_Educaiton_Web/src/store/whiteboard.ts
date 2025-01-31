/*
 * @Copyright (c) 2021 NetEase, Inc.  All rights reserved.
 * Use of this source code is governed by a MIT license that can be found in the LICENSE file
 */


import { observable, computed, action, makeObservable } from 'mobx';
import { AppStore } from './index';
import { NeWhiteBoard, WhiteBoardInitOptions, WhiteBoardSetEnableOtions, WhiteJoinRoomOtions } from '@/lib/whiteboard';
import logger from '@/lib/logger';



export class WhiteBoardStore {
  public appStore: AppStore;
  public whiteboard: NeWhiteBoard;

  @observable
  drawPlugin: any = null;

  @observable
  toolCollection: any = null;

  @observable
  wbInstance: any = null;

  constructor(appStore: AppStore) {
    makeObservable(this);
    this.appStore = appStore;
    this.whiteboard = new NeWhiteBoard();
  }

  /**
   * @description: 初始化登录白板
   * @param {WhiteBoardInitOptions} options
   * @return {*}
   */
  @action
  public async initWhiteBoard(options: WhiteBoardInitOptions): Promise<void> {
    try {
      await this.whiteboard.initWhiteboard(options)
      this.wbInstance = this.whiteboard.whiteboard;
    } catch (error) {
      logger.error('白板初始化错误', error)
    }
  }

  /**
   * @description: 加入白板
   * @param {WhiteJoinRoomOtions} options
   * @return {*}
   */
  @action
  public async joinRoom(options: WhiteJoinRoomOtions): Promise<void> {
    if (!this.wbInstance) {
      logger.error('白板尚未初始化');
      return;
    }
    try {
      await this.whiteboard.joinRoom(options);
      this.drawPlugin = this.whiteboard.drawPlugin;
      this.toolCollection = this.whiteboard.toolCollection;
    } catch (error) {
      logger.error('加入白板错误', error);
    }
  }

  /**
   * @description: 设置白板操作权限
   * @param {boolean} enbale
   * @param {WhiteBoardSetEnableOtions} options
   * @return {*}
   */
  @action
  public async setEnableDraw(enbale: boolean, options?: WhiteBoardSetEnableOtions): Promise<void> {
    if (!this.drawPlugin || !this.toolCollection) {
      logger.log('白板尚未登录');
      return;
    }
    logger.log('设置白板-store', enbale);
    await this.whiteboard.setEnableDraw(enbale, options);
  }

  /**
   * @description: 白板销毁
   * @param {*}
   * @return {*}
   */
  @action
  public destroy(): void {
    this.whiteboard && this.whiteboard.destroy();
    this.toolCollection && this.toolCollection.destroy();
    this.wbInstance = null
    logger.log('白板销毁');
  }
}
