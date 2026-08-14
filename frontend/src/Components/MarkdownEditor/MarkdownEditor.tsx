import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  Separator,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  headingsPlugin,
  imagePlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import classNames from 'classnames';
import { useIsDarkTheme } from '~/hooks';
import styles from './MarkdownEditor.module.scss';
import '@mdxeditor/editor/style.css';
import type { LegacyRef } from 'react';
import { InsertSamfImage, SamfImageDialogProvider, SamfImageDirectiveDescriptor } from './plugins/samfImage';

const codeBlockLanguages = {
  javascript: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
  xml: 'XML',
  json: 'JSON',
  markdown: 'Markdown',
  sql: 'SQL',
  python: 'Python',
  java: 'Java',
  ruby: 'Ruby',
  bash: 'Bash',
  shell: 'Shell',
  '': 'Text',
};

type ViewMode = 'rich-text' | 'source' | 'diff';

type Props = Omit<MDXEditorProps, 'markdown' | 'plugins'> & {
  defaultValue: string;
  initialValue?: string;
  containerClassName?: string;
  enableSamfImages?: boolean;
  disabled?: boolean;
  viewMode?: ViewMode;
  hideEditButtons?: boolean;
  ref?: LegacyRef<MDXEditorMethods> | undefined;
};

export function MarkdownEditor({
  defaultValue,
  initialValue,
  ref,
  contentEditableClassName,
  className,
  containerClassName,
  disabled,
  viewMode = 'rich-text',
  hideEditButtons = false,
  enableSamfImages = true,
  ...props
}: Props) {
  const isDarkTheme = useIsDarkTheme();

  return (
    <SamfImageDialogProvider>
      <div className={classNames(styles.container, containerClassName)}>
        <MDXEditor
          ref={ref}
          markdown={defaultValue}
          readOnly={disabled}
          className={classNames(
            {
              'dark-theme': isDarkTheme,
            },
            className,
          )}
          contentEditableClassName={classNames(styles.content_editable, contentEditableClassName)}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            tablePlugin(),
            directivesPlugin({
              directiveDescriptors: enableSamfImages
                ? [AdmonitionDirectiveDescriptor, SamfImageDirectiveDescriptor]
                : [AdmonitionDirectiveDescriptor],
            }),
            // Kept so pages containing plain markdown images (not using our image system) still load
            imagePlugin({ disableImageSettingsButton: true }),
            codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
            codeMirrorPlugin({ codeBlockLanguages }),

            diffSourcePlugin({
              diffMarkdown: initialValue ?? '',
              viewMode: viewMode,
              readOnlyDiff: true,
            }),

            toolbarPlugin({
              toolbarContents: () => (
                <DiffSourceToggleWrapper>
                  {hideEditButtons ? (
                    <></>
                  ) : (
                    <ConditionalContents
                      options={[
                        {
                          when: (editor) => editor?.editorType === 'codeblock',
                          contents: () => <ChangeCodeMirrorLanguage />,
                        },
                        {
                          fallback: () => (
                            <>
                              <UndoRedo />
                              <Separator />
                              <BoldItalicUnderlineToggles />
                              <BlockTypeSelect />
                              <ListsToggle />
                              <CreateLink />
                              <Separator />
                              <InsertTable />
                              <InsertCodeBlock />
                              {enableSamfImages && <InsertSamfImage />}
                              <InsertThematicBreak />
                            </>
                          ),
                        },
                      ]}
                    />
                  )}
                </DiffSourceToggleWrapper>
              ),
            }),
          ]}
          {...props}
        />
      </div>
    </SamfImageDialogProvider>
  );
}
