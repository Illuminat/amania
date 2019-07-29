<?php


namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UsersController extends Controller
{
    public function index()
    {
        return User::orderBy('last_update_time', 'desc')->get();
    }

    public function show($id)
    {
        return User::find($id);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'first_name' => 'required|string|max:45',
            'last_name' => 'required|string|max:45',
            'email' => 'required|string|email|max:255|unique:users',
            'username' => 'required|string|max:45|unique:users',
            'password' => 'required|string|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&]/',
            'is_active' => 'required|int'
        ]);

        if ($validator->fails()){
            return response()->json([
                "error" => 'validation_error',
                "message" => $validator->errors(),
            ], 422);
        }

        $request->merge(['password' => md5($request->password)]);

        try{
            User::create($request->all());
        } catch(\Exception $e) {
            return response()->json([
                "error" => "could_not_create",
                "message" => "Unable to create user"
            ], 400);
        }

        return response()->json(['status','User been created'],200);
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json([
                "error" => "could_find_user",
                "message" => "Cant find user"
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:45',
            'last_name' => 'required|string|max:45',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'username' => 'required|string|max:45|unique:users,username,'.$user->id,
            'is_active' => 'required|int'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "error" => 'validation_error',
                "message" => $validator->errors(),
            ], 422);
        }

        if (!empty($request->password)) {
            if (!preg_match('/^(?=.*[A-Z])(?=(?:.*\d){1,})(?=.*[!@$%^&*()_+=-]).{8,}$/', $request->password)) {
                return response()->json([
                    "error" => 'password_error',
                    "message" => 'Password must contain 1 upcase, 1 digit and 1 special and more then 8',
                ], 422);
            }
            $request->merge(['password' => md5($request->password)]);
        }

        $user->update($request->all());

        return response()->json(['status', 'User been updated'], 201);
    }

    public function delete(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
        } catch (\Exception $e) {
            return response()->json([
                "error" => "cant_delete_user",
                "message" => "Cant delete user"
            ], 400);
        }

        return response()->json(['status','User been deleted'],204);
    }
}
