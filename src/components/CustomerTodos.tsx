import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Session } from '@supabase/supabase-js';

interface Todo {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
}

interface CustomerTodosProps {
  session: Session;
}

const CustomerTodos = ({ session }: CustomerTodosProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, [session]);

  const fetchTodos = async () => {
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (customer) {
        const { data, error } = await supabase
          .from('customer_todos')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTodos(data || []);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل المهام",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (customer) {
        const { error } = await supabase
          .from('customer_todos')
          .insert({
            customer_id: customer.id,
            title: newTodo.trim(),
            description: ''
          });

        if (error) throw error;
        setNewTodo('');
        fetchTodos();
        toast({
          title: "تم الإضافة",
          description: "تم إضافة المهمة بنجاح"
        });
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة المهمة",
        variant: "destructive"
      });
    }
  };

  const toggleTodo = async (todoId: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('customer_todos')
        .update({ is_completed: !isCompleted })
        .eq('id', todoId);

      if (error) throw error;
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث المهمة",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      const { error } = await supabase
        .from('customer_todos')
        .delete()
        .eq('id', todoId);

      if (error) throw error;
      fetchTodos();
      toast({
        title: "تم الحذف",
        description: "تم حذف المهمة بنجاح"
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف المهمة",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center arabic">جاري التحميل...</div>
    </div>;
  }

  return (
    <div className="p-4 pb-20 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6 arabic text-center">
        قائمة المهام المنزلية
      </h1>

      {/* Add Todo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="arabic">إضافة مهمة جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="اكتب المهمة هنا..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="arabic text-right"
              dir="rtl"
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <Button onClick={addTodo} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Todos List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground arabic">لا توجد مهام حالياً</p>
            </CardContent>
          </Card>
        ) : (
          todos.map((todo) => (
            <Card key={todo.id} className={`transition-all ${todo.is_completed ? 'opacity-60' : ''}`}>
              <CardContent className="flex items-center gap-3 p-4">
                <Checkbox
                  checked={todo.is_completed}
                  onCheckedChange={() => toggleTodo(todo.id, todo.is_completed)}
                />
                <div className="flex-1">
                  <p className={`arabic text-right ${todo.is_completed ? 'line-through' : ''}`}>
                    {todo.title}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerTodos;