
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, X, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const pageSize = 10;

  // Check if user is an admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data && !error) {
          setIsAdmin(true);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    checkAdmin();
  }, [user, navigate]);

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', page],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (error) throw error;
      return { data, count };
    },
    enabled: isAdmin,
  });

  const totalPages = orders?.count ? Math.ceil(orders.count / pageSize) : 0;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const viewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  if (!isAdmin) {
    return <div className="flex justify-center items-center h-screen">Checking permissions...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            View and manage all customer orders and payment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <ArrowDown className="h-6 w-6 animate-bounce" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.data?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>{order.plan_name}</TableCell>
                      <TableCell>${order.plan_price}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{order.payment_details.email || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => viewDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {orders?.data?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            isActive={page === i + 1}
                            onClick={() => setPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Information</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                      <dd>{selectedOrder.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date</dt>
                      <dd>{formatDate(selectedOrder.created_at)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan Details</h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Plan</dt>
                      <dd>{selectedOrder.plan_name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Price</dt>
                      <dd>${selectedOrder.plan_price}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Information</h3>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd>{selectedOrder.payment_details.fullName || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd>{selectedOrder.payment_details.email || 'N/A'}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Billing Address</dt>
                    <dd className="whitespace-pre-line">{selectedOrder.payment_details.billingAddress || 'N/A'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Information</h3>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Card Number</dt>
                    <dd>{selectedOrder.payment_details.cardNumber || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                    <dd>{selectedOrder.payment_details.cardExpiry || 'N/A'}</dd>
                  </div>
                </dl>
              </div>

              {selectedOrder.payment_details.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h3>
                  <p className="mt-2 whitespace-pre-line">{selectedOrder.payment_details.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (selectedOrder.payment_details.email) {
                      window.location.href = `mailto:${selectedOrder.payment_details.email}?subject=Your Order ${selectedOrder.id}`;
                    }
                  }}
                  disabled={!selectedOrder.payment_details.email}
                >
                  Contact Customer
                </Button>
                <Button onClick={() => setShowDetails(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
