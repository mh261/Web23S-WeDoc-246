import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import {
  Validators,
  Editor,
  Toolbar,
  DEFAULT_TOOLBAR,
  toDoc,

} from 'ngx-editor';
import schema from './schema';
import nodeViews from '../../nodeviews';
import { FileService } from 'src/app/services/file.service';
import * as FileActions from 'src/app/ngrx/actions/file.action';
import { GetFileDetailState } from 'src/app/ngrx/states/file.state';
import { ActivatedRoute } from '@angular/router';
import { style } from '@angular/animations';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class PaperComponent implements OnInit, OnDestroy {
  file$ = this.fileStore.select('getFile');
  editordoc = '';
  constructor(
    public authService: AuthService,
    public fileService: FileService,
    private fileStore: Store<{ getFile: GetFileDetailState }>,
    private activedRoute: ActivatedRoute
  ) {}

  isProdMode = environment.production;

  editor: Editor = new Editor();
  toolbar: Toolbar = DEFAULT_TOOLBAR;

  form = new FormGroup({
    editorContent: new FormControl(
      { value: '', disabled: false },
      Validators.required(schema)
    ),
  });

  get doc(): AbstractControl {
    return this.form.get('editorContent') ?? new FormControl();
  }

  ngOnInit(): void {
    let input = document.querySelector(".NgxEditor__MenuBar");
    input?.classList.add('background-color');
    this.editor = new Editor({
      schema,
      nodeViews,
      history: true,
      keyboardShortcuts: true,
      inputRules: true,

      attributes: { enterkeyhint: 'enter' },
      features: {
        linkOnPaste: true,
        resizeImage: true,
      },

    });
    this.fileStore.dispatch(
      FileActions.getFileDetail({
        fileId: this.activedRoute.snapshot.params['id'],
      })
    );
    this.file$.subscribe((file) => {
      if (file) {
        this.editor.setContent(toDoc(file.file.content));
        let title = document.querySelector('#title') as HTMLInputElement;
        title.value = file.file.title;
      }
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
