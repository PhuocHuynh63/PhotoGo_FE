'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Button } from '@atoms/ui/button'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  Code,
  Underline,
  Image as ImageIcon,
} from 'lucide-react'
import { cn } from '@utils/helpers/CN'

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export default function TipTapEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  className,
  disabled = false,
}: TipTapEditorProps) {
  // Theo dõi nội dung của editor
  const [content, setContent] = useState(value || '<p></p>')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
    ],
    content: content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setContent(html)
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[200px] px-3 py-2',
        placeholder: placeholder,
      },
    },
  })

  // Cập nhật nội dung khi prop value thay đổi từ bên ngoài
  useEffect(() => {
    if (value !== content) {
      setContent(value || '<p></p>')
      if (editor) {
        editor.commands.setContent(value || '<p></p>')
      }
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  const addImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            editor.chain().focus().setImage({ src: result }).run()
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div className={cn("border rounded-md", className)}>
      {!disabled && (
        <div className="flex gap-1 p-1 border-b overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-slate-200' : ''}
            aria-label="In đậm"
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-slate-200' : ''}
            aria-label="In nghiêng"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-slate-200' : ''}
            aria-label="Tiêu đề 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}
            aria-label="Tiêu đề 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-slate-200' : ''}
            aria-label="Danh sách"
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-slate-200' : ''}
            aria-label="Danh sách số"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-slate-200' : ''}
            aria-label="Trích dẫn"
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-slate-200' : ''}
            aria-label="Mã"
          >
            <Code className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={addImage}
            aria-label="Chèn hình ảnh"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            aria-label="Hoàn tác"
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            aria-label="Làm lại"
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      )}

      <EditorContent editor={editor} className="prose prose-sm max-w-none" />

      {/* CSS để hiện thị định dạng */}
      <style jsx global>{`
        .ProseMirror h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #ccc;
          margin-left: 0.5rem;
          padding-left: 1rem;
          color: #666;
          font-style: italic;
        }
        .ProseMirror pre {
          background-color: #f5f5f5;
          padding: 0.75rem;
          border-radius: 0.25rem;
          font-family: monospace;
          overflow-x: auto;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  )
}
