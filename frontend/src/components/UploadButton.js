import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import FormData from "form-data";

// APIにアクセスするためのベースとなるURL
const baseAPIUrl = "https://api.pinata.cloud";

// dev-account.envファイルから読み込む環境変数
const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;

/**
 * UploadButton コンポーネント
 */
const UploadButton = () => {
  // ファイル名を格納するステート変数
  const [fileName, setFileName] = useState("select a file");
  // ファイル本体のデータを格納するステート変数
  const [file, setFile] = useState({});
  // 画像アップロード中であるかどうかを保持するためのフラグ用のステート変数
  const [pendingFlg, setPendingFlg] = useState(false);

  /**
   * ファイル名とファイル本体を保存するための関数
   */
  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  /**
   * PinataのAPIを利用してIPFSに画像をアップロードするメソッド
   * @param {*} event
   */
  const pintaUploadFile = async (event) => {
    // FormDataオブジェクトを生成
    let postData = new FormData();
    // APIを使って送信するリクエストパラメータを作成する。
    postData.append("file", file);
    postData.append("pinataOptions", '{"cidVersion": 1}');
    postData.append(
      "pinataMetadata",
      `{"name": "${fileName}", "keyvalues": {"company": "nearHotel"}}`
    );

    try {
      // フラグ ON
      setPendingFlg(true);
      // POSTメソッドでデータを送信する
      const res = await axios.post(
        // APIのURL
        baseAPIUrl + "/pinning/pinFileToIPFS",
        // リクエストパラメータ
        postData,
        // ヘッダー情報
        {
          headers: {
            accept: "application/json",
            pinata_api_key: `${PINATA_API_KEY}`,
            pinata_secret_api_key: `${PINATA_API_SECRET}`,
            "Content-Type": `multipart/form-data; boundary=${postData}`,
          },
        }
      );
      setPendingFlg(false);
      alert(`Successfully uploaded!! CID:${res.data.IpfsHash}`);
    } catch (e) {
      console.error("Upload failed.....：", e);
      alert("Upload failed.....");
    }
  };

  return (
    <>
      {/* 画像データアップロード中に表示するSpinnerコンポーネント */}
      {pendingFlg ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Please wait...</span>
        </Spinner>
      ) : (
        <>
          {/* Formコンポーネント */}
          <Form.Group
            controlId="formFile"
            className="mb-3"
            onChange={(e) => saveFile(e)}
          >
            <Form.Label>Please drop or select</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
          {/* Buttonコンポーネント */}
          <Button onClick={(e) => pintaUploadFile(e)} variant="info">
            Upload Image
          </Button>
        </>
      )}
    </>
  );
};

export default UploadButton;
