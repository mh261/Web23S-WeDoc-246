import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FileService } from 'src/app/services/file.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { DocumentFile } from 'src/app/models/file.model';
import * as FileActions from '../actions/file.action';

@Injectable()
export class FileEffects {
  constructor(private actions$: Actions, private fileService: FileService) {}

  createFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FileActions.createFile),
      switchMap((action) => {
        return this.fileService.createFile(action.file);
      }),
      map((file) => {
        return FileActions.createFileSuccess({ file: <DocumentFile>file });
      }),
      catchError((error) => of(FileActions.createFileFailure({ error })))
    );
  });

  // getFile$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(FileActions.getFile),
  //     switchMap((action: any) => {
  //       return this.fileService.getFile(action.fileId);
  //     }),
  //     map((file) => {
  //       return FileActions.getFileSuccess({ file: <FileModel>file });
  //     }),
  //     catchError((error) => of(FileActions.getFileFailure({ error })))
  //   );
  // });

  getFiles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FileActions.getFiles),
      switchMap(() => {
        return this.fileService.getFiles();
      }),
      map((files) => {
        return FileActions.getFilesSuccess({ files: <DocumentFile[]>files });
      }),
      catchError((error) => {
        return of(FileActions.getFilesFailure({ error: error }));
      })
    );
  });
}
